import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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
