import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";


const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const JINA_URL = process.env.JINA_URL;
const JINA_API_KEY = process.env.JINA_API_KEY;

// Funções auxiliares
const getTokenFromHeaders = (headers: Headers) => headers.get("Token");

const validateToken = async (token: string | null, secret: string) => {
  if (!token) throw new Error("Token não encontrado");
  const decoded = await verifyJWT(token, secret);
  if (typeof decoded === "object") return decoded.id;
  throw new Error("Token inválido");
};

const getFilesFromFormData = (formData: FormData) => {
  const uploadedFiles = formData.getAll("files");
  return uploadedFiles.filter((file) => file instanceof File) as File[];
};

const handleFileUpload = async (files: File[], vectorStoreId: string) => {
  let filebatch = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
    vectorStoreId,
    { files }
  );

  while (filebatch.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 300));
    filebatch = await openai.beta.vectorStores.fileBatches.retrieve(
      vectorStoreId,
      filebatch.id
    );
  }

  return filebatch;
};

const processTextCorrection = async (
  assistantId: string,
  text: string,
  vectorStoreId?: string
) => {
  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: JSON.stringify(text ? { text } : "corrija o conteúdo do arquivo"),
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  let retrieveRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);

  while (retrieveRun.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 300));
    retrieveRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  return retrieveRun;
};

const saveCorrectionResult = async (
  uuid: string,
  id: string,
  text: string,
  parsedContent: any
) => {
  return await prisma.correcao.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: { texto: text },
      authorId: id,
      content: parsedContent,
    },
  });
};

// Handlers
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = getTokenFromHeaders(request.headers);
    const secret = process.env.SECRET;

    if (!secret) throw new Error("Erro interno do servidor");

    const userId = await validateToken(token, secret);
    const uuid = uuidv4();
    const text = formData.get("texto") as string;
    const files = getFilesFromFormData(formData);

    let assistant = await openai.beta.assistants.create({
      name: uuid,
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }],
      instructions:
        'Você é um assistente de correção de textos e trabalhos. Dado uma entrada do usuário corrija o texto ou o arquivo enviado por ele. de a resposta no seguinte formato json {"resumoCorrecao": {"totalErros": 25,"categorias": {"gramatica": 10,"ortografia": 7,"pontuacao": 5,"estilo": 2,"precisaoDados": 1},"melhoriasSugeridas": "Revisar a precisão dos dados e corrigir a gramática nas sessões indicadas."},"correcoes": [{"localizacao": {"sessao": "Introducao","proximoDe": "subtitulo: Mudancas Climaticas"},"frase": "O homem é a causa principais das mudanças climáticas.","erro": {"tipo": "gramatica","descricao": "Concordância verbal incorreta"},"sugestao": "O homem é a causa principal das mudanças climáticas.","status": "corrigido"},{"localizacao": {"sessao": "Conclusao","proximoDe": "paragrafo final"},"frase": "As pessoas deviam refletir sobre os seu atos.","erro": {"tipo": "ortografia","descricao": "Erro de ortografia: "seu" deve ser "seus"."},"sugestao": "As pessoas deviam refletir sobre os seus atos.","status": "corrigido"},{"localizacao": {"sessao": "Capitulo2","proximoDe": "subtitulo: Impacto no Brasil"},"frase": "A emissão de CO2 no Brasil é a maior do mundo.","erro": {"tipo": "precisaoDados","descricao": "Informação incorreta: O Brasil não é o maior emissor de CO2 no mundo."},"sugestao": "Corrigir para: A emissão de CO2 no Brasil está entre as mais altas da América Latina, mas não é a maior do mundo.","status": "pendente"}],"notasRevisao": [{"localizacao": {"sessao": "Capitulo1","proximoDe": "inicio do capitulo"},"comentario": "Considerar adicionar uma fonte de pesquisa para suportar essa afirmação.","sugestao": "Adicionar referência acadêmica."}]}",}); Tenha em mente que precisão dos dados se trata da veracidade das informações ali presentes. O json não deve começar com ```json e sim com { e terminar com }. deve ser um json convertivel atráves do metodo JSON.parse Utilize sempre de aspas duplas para as chaves e valores do json.',
    });

    const vectorStore = await openai.beta.vectorStores.create({ name: uuid });

    if (files.length > 0) {
      await handleFileUpload(files, vectorStore.id);

      assistant = await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      });
    }

    const correctionRun = await processTextCorrection(assistant.id, text);

    if (correctionRun.status === "completed") {
      const messages = await openai.beta.threads.messages.list(
        correctionRun.thread_id
      );
      const content = (messages as any).body.data[0].content[0].text.value;
      const parsedContent = JSON.parse(content);

      const savedContent = await saveCorrectionResult(uuid, userId, text, parsedContent);

      return new Response(JSON.stringify({ id: savedContent.id }));
    }

    throw new Error("Erro interno do servidor");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(errorMessage, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    const secret = process.env.SECRET;

    if (!secret) throw new Error("Erro interno do servidor");

    const userId = await validateToken(token, secret);

    const correcoes = await prisma.correcao.findMany({
      where: { authorId: userId },
    });

    return new Response(JSON.stringify(correcoes));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(errorMessage, { status: 500 });
  }
}
