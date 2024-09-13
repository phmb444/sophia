import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from 'fs';
import path from 'path';  

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JINA_URL = process.env.JINA_URL;
const JINA_API_KEY = process.env.JINA_API_KEY;

export async function POST(request: Request) {
  const parameters = await request.json();
  parameters.webContent = [];
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
          "Você é um otimizador de querys, dado parametros crie 3 querys otimizadas para pequisas de em um mecanismo de busca como google a respeito do tema, faça cada query buscar um assunto diferente dentro do mesmo tema faça elas serem curtas com no maximo 10 palavras, responda em um formato semelhante a esse 'When%20was%20Jina%20AI%20founded%3F', De a query em portugues brasileiro. Elas devem estar em um JSON com a propridade querys que deve conter um array com apenas o texto das querys. Começa sempre com Exercicios sobre... ou Questões sobre... e coloque também o nível de escolaridade, por exemplo: Exercicios sobre matemática para ensino fundamental.",
      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const querys = JSON.parse(query.choices[0].message.content ?? "");

  for (let i = 0; i < querys.querys.length; i++) {
    querys.querys[i] = querys.querys[i].replace(/ /g, "%20");
  }

  // Executar os fetchs de forma assíncrona e esperar todos serem resolvidos
  const fetchPromises = querys.querys.map(async (query: any) => {
    const busca = `${JINA_URL}${query}`;
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
  });

  // Esperar que todas as requisições sejam resolvidas
  const results = await Promise.all(fetchPromises);

  // Adicionar os resultados ao parameters.webContent
  results.forEach((result) => {
    parameters.webContent.push(...result);
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Você é um assistente de IA educacional projetado para gerar exercícios com base na entrada do usuário. Responda com um JSON contendo os exercícios solicitados, seguindo os parâmetros fornecidos. O parametro WebContent irá conter links de sites e seus respectivos conteúdos que devem conter exercicios sobre o tema, utilize desse contéudo para gerar os exercicios, De preferências para exercicios que estejam dentro do WebContent, e coloque juntamente do enunciado deles o seu link original. A resposta deve ser um JSON válido, sem quebras de linha ou outros caracteres especiais, e deve incluir um array chamado "questions". Cada item deste array deve conter os seguintes atributos: "question": O texto da pergunta. "type": O tipo de questão, que pode ser "alternativa" ou "dissertativa". Se o tipo for "alternativa", deve conter um objeto "options" com as propriedades "a", "b", "c", e "d", cada uma com o texto da respectiva alternativa. O item também deve conter um "correct_answer" com a letra da alternativa correta e uma "explanation" explicando por que essa resposta está correta. Se o tipo for "dissertativa", deve conter um "answer" com a resposta por extenso. Exemplo de JSON de saída: {"questions": [{"question": "Qual é a capital da França?","type": "alternativa","options": {"a": "Berlim","b": "Madrid","c": "Paris","d": "Lisboa"},"correct_answer": "c","explanation": "Paris é a capital da França."},{"question": "Explique o conceito de evolução segundo Darwin.","type": "dissertativa","answer": "A teoria da evolução de Darwin sugere que as espécies evoluem ao longo do tempo através de um processo de seleção natural."}]}. caso o exercicio tenha sua fonte como um dos sites do WebContent, coloque o link original do site na propriedade "source" do exercicio. Tome cuidado para nao criar alternativas muito grandes que possam exceder 120 caracteres',
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

export async function PUT(request: Request) {
  const formData = await request.formData();
  const token = request.headers.get("Token");

  if (!token) {
    return new Response("Token não encontrado", { status: 401 });
  }

  const secret = process.env.SECRET;
  if (!secret) {
    return new Response("Erro interno do servidor", { status: 500 });
  }

  // Extrair os parâmetros do FormData
  const tema = formData.get("tema") as string;
  const quantidade = formData.get("quantidade") as string;
  const nivel = formData.get("nivel") as string;
  const tipos = JSON.parse(formData.get("tipos") as string); // Parse JSON string to array

  const files: File[] = [];
  const uploadedFiles = formData.getAll("files"); // `files` is the key used in the frontend FormData

  // Processar os arquivos (caso existam)
  for (const file of uploadedFiles) {
    if (file instanceof File) {
      files.push(file);
    }
  }

  // Verifica o token
  let id;
  let decoded = await verifyJWT(token, secret);
  if (typeof decoded === "object") {
    id = decoded.id;
  }

  // Cria o assistente e o vetor de armazenamento
  let assistant = await openai.beta.assistants.create({
    name: `${tema}_${id}`,
    model: "gpt-4o-mini",
    tools: [{ type: "file_search" }],
    instructions: 'Você é um assistente de IA educacional projetado para gerar exercícios com base na entrada do usuário. Responda com um JSON contendo os exercícios solicitados, seguindo os parâmetros fornecidos. A resposta deve ser um JSON válido, sem quebras de linha ou outros caracteres especiais, e deve incluir um array chamado "questions". Cada item deste array deve conter os seguintes atributos: "question": O texto da pergunta. "type": O tipo de questão, que pode ser "alternativa" ou "dissertativa". Se o tipo for "alternativa", deve conter um objeto "options" com as propriedades "a", "b", "c", e "d", cada uma com o texto da respectiva alternativa. O item também deve conter um "correct_answer" com a letra da alternativa correta e uma "explanation" explicando por que essa resposta está correta. Se o tipo for "dissertativa", deve conter um "answer" com a resposta por extenso. Exemplo de JSON de saída: {"questions": [{"question": "Qual é a capital da França?","type": "alternativa","options": {"a": "Berlim","b": "Madrid","c": "Paris","d": "Lisboa"},"correct_answer": "c","explanation": "Paris é a capital da França."},{"question": "Explique o conceito de evolução segundo Darwin.","type": "dissertativa","answer": "A teoria da evolução de Darwin sugere que as espécies evoluem ao longo do tempo através de um processo de seleção natural."}]}. Tome cuidado para nao criar alternativas muito grandes que possam exceder 120 caracteres',
  });

  const vector_store = await openai.beta.vectorStores.create({ name: `${tema}_${id}` });
  
  // Fazer upload dos arquivos usando fileBatches
  let filebatch = await openai.beta.vectorStores.fileBatches.uploadAndPoll(vector_store.id, { files });

  while (filebatch.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 300));
    filebatch = await openai.beta.vectorStores.fileBatches.retrieve(vector_store.id, filebatch.id);
  }

  assistant = await openai.beta.assistants.update(assistant.id, {
    tool_resources: { "file_search": { "vector_store_ids": [vector_store.id] } }
  });

  const thread = await openai.beta.threads.create();

  const parameters = { tema, quantidade, nivel, tipos }; // Dados do formulário
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: JSON.stringify(parameters),
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let retrieveRun = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);

  while (retrieveRun.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 300));
    retrieveRun = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
  }

  if (retrieveRun.status === "completed") {
    const messages = await openai.beta.threads.messages.list(thread.id);
    const content = (messages as any).body.data[0].content[0].text.value;
    const parsedContent = JSON.parse(content);
    const uuid = uuidv4();
    const savedContent = await prisma.exercises.create({
      data: {
        id: uuid,
        v: 1,
        date: new Date(),
        params: parameters,
        content: parsedContent,
      }
    });
    return new Response(JSON.stringify({ id: savedContent.id }));
  }

  return new Response("Erro interno do servidor", { status: 500 });
}

