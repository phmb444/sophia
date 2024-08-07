import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DataFromUser {
  tema: string;
  quantidade: string;
  nivel: string;
  tipos: string[];
}

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
  let id
  let decoded = await verifyJWT(token, secret);
  if (typeof(decoded) === 'object') {
  console.log(decoded.id);
  id = decoded.id;
  }
  

  const response = await openai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-1106:personal:exercise-generator:9pzA0XI9",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de IA feito para gerar exercícios, dado uma entrada do usuário, reponda em JSON uma mensagem contendo os exercicios solicitados e seguindo os requisitos, o valor referente ao output: nao deve conter /n ou etc, deve ser um json convertivel",
      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const content = response.choices[0].message?.content;
  let parsedContent;
  if (content) {
    parsedContent = JSON.parse(content);
    parsedContent = JSON.parse(parsedContent.output);
    console.log(parsedContent);
  }
  const uuid = uuidv4();

  const savedContent = await prisma.exercises.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: parameters,
      content: parsedContent,
      author:{
        connect: {id : id}
      }
    },
  });
  return new Response (JSON.stringify(parsedContent));
}
