import { verifyJWT } from "@/lib/util";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateText, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { v4 as uuidv4 } from "uuid";
import {z} from 'zod';
import { generateOptimizedQueries, generateExercises } from "../exercises/route";
import { create } from "domain";

const prisma = new PrismaClient();
const JINA_URL = process.env.JINA_URL;
const JINA_API_KEY = process.env.JINA_API_KEY;
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

  const title = await generateChatTitle(messages); // Function to generate chat title

  const existingChat = await prisma.chat.findUnique({
    where: { id: chatId, authorId: userId },
  });

  if (existingChat) {
    await prisma.chat.update({
      where: { id: chatId },
      data: { content: messages, title }, // Update title
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
      title, // Set title
      author: { connect: { id: userId } },
    },
  });
  return chatId;
}

async function generateChatTitle(messages: { role: string; content: string }[]): Promise<string> {
  const model = openai("gpt-4o-mini");
  const {text} = await generateText({
    system: "dado um conjunto de mensagens, gerar um título curto para o chat, nao utilize de markdown nem de '' ou `` para começar e terminar o texto, apenas o texto com pontuação normal, também não coloque sophia no titulo dos textos gerados, coloque apenas sobre o que se trata a conversa",
    model,
    prompt: messages.map((m) => `${m.role === "user" ? "Você" : "Sophia"}: ${m.content}`).join("\n"),
  });
  return text;
}

async function handleChatPost(req: Request) {
  const { messages, chat_id } = await req.json();
  const userIdOrResponse = await authenticateUser(req);
  if (typeof userIdOrResponse !== "string") return userIdOrResponse;

  const userId = userIdOrResponse;
  const model = openai("gpt-4o-mini");

  const result = await streamText({
    system: "Seu nome é Sophia, um assistente educacional baseado em inteligência artificial, suas respostas devem estar em Markdown puro, utilize a ferramenta de webSearch para complementar suas respostas com conteúdos tirados da web, referêncie no final de todas as respostas o links do conteúdo que foi retornado pela busca, faça com que os links fiquem em azul, tenham um hover que deixe sublinhado e que o link abra em outra guia. Para a ferramenta de criar exercicios a utilize quando o usuário pedir ajuda para estudar sobre um certo assunto, pergunte ao usuário mais informações sobre o que ele deseja, como tema, quantidade, nível e tipos de exercícios, após isso, chame essa ferramenta com os parametros fornecidos, a resposta da ferramenta será um link para a página dos exercícios gerados que você deve incluir no texto de resposta destacado em azul e com hover sublinhado, faça com que o link abra no url aprendacomsophia.com/exercises/id_do_exercicio",
    model,
    messages,
    maxTokens: 1024,
    maxSteps: 5,  
    temperature: 0.7,
    async onFinish({ text }) {
      messages.push({ role: "assistant", content: text });
      await saveChatMessage(userId, chat_id, messages);
    },
    tools: {
      webSearch: tool({
        description: "Buscar conteúdo na web, utilize essa ferramenta para buscar conteúdo na web para complementar suas respostas, não é necessário pedir permissão do usuário para isto, no final de toda resposta referêncie os links que foram retornados pela busca.", 
        parameters: z.object({
          query:  z.string().describe('Query para busca na web')
      }),
        execute: async ({ query }) => fetchWebContent(query),
        
      }),
      createExercises: tool({
        description: "Gerar uma lista de exercicios para o usuário com base nos parametros fornecidos, antes de chamar essa ferramenta, pergunte ao usuário mais informações sobre o que ele deseja, como tema, quantidade, nível e tipos de exercícios, após isso, chame essa ferramenta com os parametros fornecidos, a resposta da ferramenta será um link para a página dos exercícios gerados",
        parameters: z.object({
          tema: z.string().describe('Tema dos exercícios'),
          quantidade: z.string().describe('Quantidade de exercícios'),
          nivel: z.string().describe('Nível dos exercícios'),
          tipos: z.array(z.string()).describe('Tipos de exercícios, só podem ser "Alternativas" ou "Dissertativas"')
        }),
        execute: async (params) => {
          const exerciseId = await generateAndSaveExercises(params);
          return `/exercises/${exerciseId}`;
        }
      })
    }
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
    return new Response(JSON.stringify({ messages: chat.content, title: chat.title }), { headers: { "Content-Type": "application/json" } });
  }

  const chats = await prisma.chat.findMany({
    where: { authorId: userId },
    orderBy: { date: "desc" },
    select: { id: true, title: true },
  });

  const chatSummaries = chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
  }));

  return new Response(JSON.stringify(chatSummaries), { headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request) {
  return handleChatPost(req);
}

export async function GET(req: Request) {
  return handleChatGet(req);
}

async function fetchWebContent(query: string): Promise<any[]> {
  try {
    const formattedQuery = query.replace(/ /g, "%20");
    const busca = `${JINA_URL}${formattedQuery}`;
    console.log(busca);

    const webContent = await fetch(busca, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JINA_API_KEY}`,
        Accept: "application/json",
        "X-Locale": "pt-BR",
      },
    });

    const data = await webContent.json();
    return [data.data[0], data.data[1], data.data[2]];
  } catch (error) {
    console.error(`Erro ao buscar conteúdo web para a query "${query}":`, error);
    return [];
  }
}

interface ExerciseParameters {
  tema: string;
  quantidade: string;
  nivel: string;
  tipos: string[];
  webContent?: any[];
}

// Esta função é a mesma da rota POST, apenas sem a verificação do token
async function generateAndSaveExercises(
  parameters: ExerciseParameters
): Promise<string> {
  const uuid = uuidv4();
  const serializedParams = serializeParameters(parameters);
  const webContentPromises = (await generateOptimizedQueries(parameters)).map(
    fetchWebContent
  );
  const webContentResults = await Promise.all(webContentPromises);
  parameters.webContent = webContentResults.flat();

  const exercises = await generateExercises(parameters);
  const savedContent = await prisma.exercises.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: serializedParams as Prisma.InputJsonValue,
      content: exercises,
    },
  });

  return savedContent.id;
}

type SerializableExerciseParameters = {
  [K in keyof ExerciseParameters]: ExerciseParameters[K] extends (infer U)[]
    ? U extends object
      ? string // Serialize arrays of objects to string
      : ExerciseParameters[K]
    : ExerciseParameters[K];
};

function serializeParameters(
  params: ExerciseParameters
): SerializableExerciseParameters {
  return {
    ...params,
    tipos: params.tipos,
    webContent: params.webContent ? params.webContent : [],
  };
}
