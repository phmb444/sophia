import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JINA_URL = process.env.JINA_URL;
const JINA_API_KEY = process.env.JINA_API_KEY;

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = request.headers.get("Token");

  if (!token) {
    return new Response("Token não encontrado", { status: 401 });
  }

  const secret = process.env.SECRET;
  if (!secret) {
    return new Response("Erro interno do servidor", { status: 500 });
  }
  const uuid = uuidv4();
  // Extrair os parâmetros do FormData
  const texto = formData.get("texto") as string;
  const files: File[] = [];
  const uploadedFiles = formData.getAll("files"); // `files` is the key used in the frontend FormData

  // Processar os arquivos (caso existam)
  if (uploadedFiles.length > 0) {
    for (const file of uploadedFiles) {
      if (file instanceof File) {
        files.push(file);
      }
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
    name: uuid,
    model: "gpt-4o-mini",
    tools: [{ type: "file_search" }],
    instructions:
      'Você é um assistente de correção de textos e trabalhos. Dado uma entrada do usuário corrija o texto ou o arquivo enviado por ele. de a resposta no seguinte formato json {"resumoCorrecao": {"totalErros": 25,"categorias": {"gramatica": 10,"ortografia": 7,"pontuacao": 5,"estilo": 2,"precisaoDados": 1},"melhoriasSugeridas": "Revisar a precisão dos dados e corrigir a gramática nas sessões indicadas."},"correcoes": [{"localizacao": {"sessao": "Introducao","proximoDe": "subtitulo: Mudancas Climaticas"},"frase": "O homem é a causa principais das mudanças climáticas.","erro": {"tipo": "gramatica","descricao": "Concordância verbal incorreta"},"sugestao": "O homem é a causa principal das mudanças climáticas.","status": "corrigido"},{"localizacao": {"sessao": "Conclusao","proximoDe": "paragrafo final"},"frase": "As pessoas deviam refletir sobre os seu atos.","erro": {"tipo": "ortografia","descricao": "Erro de ortografia: "seu" deve ser "seus"."},"sugestao": "As pessoas deviam refletir sobre os seus atos.","status": "corrigido"},{"localizacao": {"sessao": "Capitulo2","proximoDe": "subtitulo: Impacto no Brasil"},"frase": "A emissão de CO2 no Brasil é a maior do mundo.","erro": {"tipo": "precisaoDados","descricao": "Informação incorreta: O Brasil não é o maior emissor de CO2 no mundo."},"sugestao": "Corrigir para: A emissão de CO2 no Brasil está entre as mais altas da América Latina, mas não é a maior do mundo.","status": "pendente"}],"notasRevisao": [{"localizacao": {"sessao": "Capitulo1","proximoDe": "inicio do capitulo"},"comentario": "Considerar adicionar uma fonte de pesquisa para suportar essa afirmação.","sugestao": "Adicionar referência acadêmica."}]}",}); Tenha em mente que precisão dos dados se trata da veracidade das informações ali presentes. O json não deve começar com ```json e sim com { e terminar com }. deve ser um json convertivel atráves do metodo JSON.parse Utilize sempre de aspas duplas para as chaves e valores do json.',
  });

  const vector_store = await openai.beta.vectorStores.create({ name: uuid });

  // Fazer upload dos arquivos usando fileBatches
  if (files.length > 0) {
    let filebatch = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
      vector_store.id,
      { files }
    );

    while (filebatch.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      filebatch = await openai.beta.vectorStores.fileBatches.retrieve(
        vector_store.id,
        filebatch.id
      );
    }

    assistant = await openai.beta.assistants.update(assistant.id, {
      tool_resources: { file_search: { vector_store_ids: [vector_store.id] } },
    });
  }

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: JSON.stringify(
      texto ? { text: texto } : "corrija o conteúdo do arquivo"
    ),
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let retrieveRun = await openai.beta.threads.runs.retrieve(
    run.thread_id,
    run.id
  );

  while (retrieveRun.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 300));
    retrieveRun = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
  }

  if (retrieveRun.status === "completed") {
    const messages = await openai.beta.threads.messages.list(thread.id);
    const content = (messages as any).body.data[0].content[0].text.value;
    console.log(content);
    const parsedContent = JSON.parse(content);
    const savedContent = await prisma.correcao.create({
      data: {
        id: uuid,
        v: 1,
        date: new Date(),
        params: { texto },
        authorId: id,
        content: parsedContent,
      },
    });
    return new Response(JSON.stringify({ id: savedContent.id }));
  }

  return new Response("Erro interno do servidor", { status: 500 });
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
    const correcoes = await prisma.correcao.findMany({
      where: {
        authorId: decoded.id,
      },
    });
    return new Response(JSON.stringify(correcoes));
  }
  return new Response("Token inválido");
}
