import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

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
    messages: [
      {
        role: "system",
        content:
          'Você é um assistente de IA educacional projetado para gerar roteiros de estudo com base na entrada do usuário. Responda com um texto em formato markdown contendo os tópicos sobre aquele assunto e fontes as quais ele pode utilizar para estudar sobre o tema, caso possível forneca links, adapte a profundidade e tipo de explicação ',
      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    temperature: 1,
    max_tokens: 16384,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const contentToSave = response.choices[0].message?.content?.toString();
  if (contentToSave) {
    fs.writeFileSync("/Users/pedro/Desktop/sophia/sophia/app/api/roteiros/output.md", contentToSave);
  }

  const uuid = uuidv4();

  const savedContent = await prisma.roteiros.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: parameters,
      content: contentToSave ?? "",  // Provide a default value if contentToSave is undefined
      author: {
        connect: { id: id },
      },
    },
  });
  return new Response(JSON.stringify({ id: savedContent.id }))
  
  
}
