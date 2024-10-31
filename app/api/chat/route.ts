import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

async function authenticateUser(request: Request): Promise<string | Response> {
  const token = request.headers.get("Token");
  if (!token) return new Response("Token não encontrado", { status: 401 });
  if (!SECRET) return new Response("Erro interno do servidor", { status: 500 });

  const decoded = await verifyJWT(token, SECRET);
  return typeof decoded === "object" ? decoded.id : new Response("Token inválido", { status: 401 });
}

async function saveChatMessage(userId: string, chatId: string, messages: { role: string; content: string }[]): Promise<string> {
  if (!chatId) throw new Error("Chat ID is required");

  const existingChat = await prisma.chat.findUnique({
    where: { id: chatId, authorId: userId },
  });

  if (existingChat) {
    await prisma.chat.update({
      where: { id: chatId },
      data: { content: messages },
    });
    return chatId;
  }

  await prisma.chat.create({
    data: {
      id: chatId,
      v: 1,
      date: new Date(),
      params: {},
      content: messages,
      author: { connect: { id: userId } },
    },
  });
  return chatId;
}

async function handleChatPost(req: Request) {
  const { messages, chat_id } = await req.json();
  const userIdOrResponse = await authenticateUser(req);
  if (typeof userIdOrResponse !== "string") return userIdOrResponse;

  const userId = userIdOrResponse;
  const model = openai("gpt-4o-mini");

  const result = await streamText({
    system: "Seu nome é Sophia, um assistente educacional baseado em inteligência artificial",
    model,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
    async onFinish({ text }) {
      messages.push({ role: "assistant", content: text });
      await saveChatMessage(userId, chat_id, messages);
    },
  });

  return result.toDataStreamResponse();
}

async function handleChatGet(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chat_id");
  const userIdOrResponse = await authenticateUser(req);
  if (typeof userIdOrResponse !== "string") return userIdOrResponse;

  const userId = userIdOrResponse;

  if (chatId) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, authorId: userId },
      include: { author: true },
    });

    if (!chat) return new Response("Chat not found", { status: 404 });
    return new Response(JSON.stringify(chat.content), { headers: { "Content-Type": "application/json" } });
  }

  const chats = await prisma.chat.findMany({
    where: { authorId: userId },
    orderBy: { date: "desc" },
    select: { id: true, date: true, content: true },
  });

  const chatSummaries = chats.map((chat) => ({
    id: chat.id,
    date: chat.date,
    firstMessage: Array.isArray(chat.content) && chat.content.length > 0 ? chat.content[0] : "",
  }));

  return new Response(JSON.stringify(chatSummaries), { headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request) {
  return handleChatPost(req);
}

export async function GET(req: Request) {
  return handleChatGet(req);
}
