import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request: Request) {
  const parameters = await request.json();
  const token = request.headers.get("Token");
  if (!token) {
    return new Response("Token não encontrado");
  }
  const secret = process.env.SECRET;
  if (!secret) {
    return new Response("Erro interno do servidor");
  }
  let id;
  let decoded = await verifyJWT(token, secret);
  if (typeof decoded === "object") {
    id = decoded.id;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Você é um assistente de IA educacional projetado para gerar exercícios com base na entrada do usuário. Responda com um JSON contendo os exercícios solicitados, seguindo os parâmetros fornecidos. A resposta deve ser um JSON válido, sem quebras de linha ou outros caracteres especiais, e deve incluir um array chamado "questions". Cada item deste array deve conter os seguintes atributos: "question": O texto da pergunta. "type": O tipo de questão, que pode ser "alternativa" ou "dissertativa". Se o tipo for "alternativa", deve conter um objeto "options" com as propriedades "a", "b", "c", e "d", cada uma com o texto da respectiva alternativa. O item também deve conter um "correct_answer" com a letra da alternativa correta e uma "explanation" explicando por que essa resposta está correta. Se o tipo for "dissertativa", deve conter um "answer" com a resposta por extenso. Exemplo de JSON de saída: {"questions": [{"question": "Qual é a capital da França?","type": "alternativa","options": {"a": "Berlim","b": "Madrid","c": "Paris","d": "Lisboa"},"correct_answer": "c","explanation": "Paris é a capital da França."},{"question": "Explique o conceito de evolução segundo Darwin.","type": "dissertativa","answer": "A teoria da evolução de Darwin sugere que as espécies evoluem ao longo do tempo através de um processo de seleção natural."}]}' 

      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    temperature: 1,
    max_tokens: 16383,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const content = response.choices[0].message?.content;
  let parsedContent;
  if (content) {
    parsedContent = JSON.parse(content);
  }
  const uuid = uuidv4();

  const savedContent = await prisma.exercises.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: parameters,
      content: parsedContent,
      author: {
        connect: { id: id },
      },
    },
  });
  return new Response(JSON.stringify({ id: savedContent.id }));
}

export async function GET(request: Request) {
  const token = request.headers.get("Token");
  if (!token) {
    return new Response("Token não encontrado");
  }
  const secret = process.env.SECRET;
  if (!secret) {
    return new Response("Erro interno do servidor");
  }
  let decoded = await verifyJWT(token, secret);
  if (typeof decoded === "object") {
    const exercises = await prisma.exercises.findMany({
      where: {
        authorId: decoded.id,
      },
    });
    return new Response(JSON.stringify(exercises));
  }
  return new Response("Token inválido");
}