import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JINA_URL = process.env.JINA_URL;
const JINA_API_KEY = process.env.JINA_API_KEY;




// criar roteiro
export async function POST(request: Request) {
  let parameters = await request.json();
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

  

  const query = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um otimizador de querys, dado parametros crie uma query otimizada para pequisas em um mecanismo de busca como google, faça ela ser curta com no maximo 10 palavras, responda em um formato semelhante a esse 'When%20was%20Jina%20AI%20founded%3F', De a query em portugues brasileiro",
      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  let busca = (JINA_URL ?? '') + (query.choices[0].message.content ?? '').toString();
  console.log(busca);

  const webContent = await fetch(busca, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${JINA_API_KEY}`,
      "Accept": "application/json",
    },
  });
  parameters.webContent = await webContent.json(); 
  parameters.webContent = parameters.webContent.data

  if (JSON.stringify(parameters).length > 60000) {
    console.log("parameters too long, truncating");
    parameters = parameters.substring(0, 60000);
  }


  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de IA educacional especializado em gerar roteiros de estudo personalizados. Ao receber uma solicitação de um usuário, responda em formato HTML, estruturando o conteúdo com tópicos e subtópicos relevantes ao tema solicitado. Utilize TailwindCSS para estilizar o HTML, sem adicionar padding ou shadow ao conteúdo. Ao citar fontes, inclua apenas links confiáveis e verificados, evitando mencionar sites ou vídeos cujos links não sejam 100% seguros e válidos. Ajuste a profundidade e o estilo das explicações de acordo com o nível de complexidade necessário, garantindo clareza e organização no conteúdo apresentado. Lembre-se de que você não precisa adicionar os parâmetros no corpo do texto. Forneça um roteiro completo e bem feito, abordando o tema da melhor maneira possível. Não inicie a resposta com ```html, apenas insira o código HTML diretamente. Utilize o texto fornecido dentro do parametro webContent para ajudar a gerar o roteiro e utilize dos links junto ao roteiro. Deixe os links destacados em azul e sublinhados.",
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

// histórico de roteiros
export async function GET(request: Request) {
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

  const roteiros = await prisma.roteiros.findMany({
    where: {
      authorId: id,
    },
  });

  return new Response(JSON.stringify(roteiros));
}
