import OpenAI from "openai";
import { verifyJWT } from "@/lib/util";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const JINA_URL = process.env.JINA_URL;
const JINA_API_KEY = process.env.JINA_API_KEY;
const SECRET = process.env.SECRET ?? "";

// Função auxiliar para validar o token
async function validateToken(token: string | null, secret: string): Promise<string | Response> {
  if (!token) return new Response("Token não encontrado", { status: 401 });
  if (!secret) return new Response("Erro interno do servidor", { status: 500 });

  const decoded = await verifyJWT(token, secret);
  if (typeof decoded === "object") return decoded.id;

  return new Response("Token inválido", { status: 401 });
}

// Função auxiliar para gerar querys otimizadas
async function generateOptimizedQueries(parameters: any): Promise<string[]> {
  const queryResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um otimizador de querys, dado parametros crie 3 querys otimizadas para pequisas de exercicios em um mecanismo de busca como google a respeito do tema, faça cada query buscar um assunto diferente dentro do mesmo tema faça elas serem curtas com no maximo 10 palavras, responda em um formato semelhante a esse 'When%20was%20Jina%20AI%20founded%3F', De a query em portugues brasileiro. Elas devem estar em um JSON com a propridade querys que deve conter um array com apenas o texto das querys",
      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
    max_tokens: 256,
  });

  const queryData = JSON.parse(queryResponse.choices[0].message.content ?? "");
  return queryData.querys.map((query: string) => query.replace(/ /g, "%20"));
}

// Função auxiliar para buscar conteúdo da web usando as querys geradas
async function fetchWebContent(query: string): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error(`Erro ao buscar conteúdo web para a query "${query}":`, error);
    return [];
  }
}

// Função para criar roteiro baseado em parâmetros e conteúdo da web
async function generateStudyPlan(parameters: any): Promise<any> {
  const studyPlanResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: 'Você é um assistente de IA educacional especializado em gerar roteiros de estudo personalizados. Ao receber uma solicitação de um usuário, responda em formato JSON utilizando o seguinte padrão: {"items":[{"title":"Introduction to React","duration":"2 hours","content":"<p>Learn the basics of React, including components, props, and state.</p>"},{"title":"State Management","duration":"1.5 hours","content":"<p>Explore state management in React, focusing on hooks like useState and useContext.</p>"},{"title":"React Router","duration":"1 hour","content":"<p>Understand how to implement routing in React applications using React Router.</p>"},{"title":"API Integration","duration":"2 hours","content":"<p>Learn how to integrate APIs into your React app using fetch or axios.</p>"},{"title":"Testing React Applications","duration":"1.5 hours","content":"<p>Introduction to testing React components using Jest and React Testing Library.</p>"}],"title":"React Development","description":"A comprehensive guide to learning React, from the basics to advanced topics.","instructions":"You may study 2 hours a day...", "introduction": "some text here" ,"details":{"timeToComplete":"8 hours","objective":"Learn how to build modern web applications using React."}}. Dentro do campo "content" de cada item, insira um texto em formato HTML com tudo que o usuário deve ver sobre aquele tópico e com os links relacionados ao tópico ali. Ao citar fontes, inclua apenas links confiáveis verficador e fornecidos atráves do webContent, evitando mencionar sites ou vídeos cujos links não sejam 100% seguros e válidos. Ajuste a profundidade e o estilo das explicações de acordo com o nível de complexidade necessário, garantindo clareza e organização no conteúdo apresentado. Forneça um roteiro completo e bem feito, abordando o tema da melhor maneira possível. Não inicie os HTMLs com ```html nem o JSON com ````json, apenas insira o código HTML e json diretamente. Utilize o texto fornecido dentro do parâmetro webContent para ajudar a gerar o roteiro e utilize os links junto ao roteiro. Deixe os links destacados em azul, sublinhados e sempre faça com que eles tenham target="_blank". A seguir vem uma descrição do que é um roteiro de estudos e quais tópicos você deve prestar atenção: Um roteiro de estudos é um documento que serve para organizar tudo o que você precisa estudar em um determinado prazo, a ordem em que pretende fazer isso e de que modo. A ideia é especificar as disciplinas, exercícios, pesquisas, atividades complementares e quaisquer outras estratégias adotadas para o aprendizado. É importante que o roteiro considere desde a parte teórica, com a leitura do material, até a prática, com exercícios de fixação, pesquisas e a revisão. Dessa maneira, você pode concluir todas as etapas no período disponível para fazer isso. Avalie a sua disponibilidade de tempo. Uma parte essencial do roteiro é especificar quais momentos serão dedicados a quais matérias. Para isso, o primeiro passo é contabilizar quantas horas por dia você vai poder estudar. Se só conseguir fazer isso em um turno, por exemplo, então o roteiro deve ser organizado de acordo com tal disponibilidade de tempo. Determine o que vai estudar. Faça uma lista dos conteúdos a serem estudados. E por ultimo, de a resposta inteira em português brasileiro, não coloque nada sem ser alguns termos necessários em outras linguas',
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

  return JSON.parse(studyPlanResponse.choices[0].message?.content ?? "");
}

// Função para salvar o roteiro gerado no banco de dados
async function saveStudyPlan(userId: string, parameters: any, content: any): Promise<string> {
  const uuid = uuidv4();
  const savedContent = await prisma.roteiros.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: parameters,
      content: content ?? {},
      author: { connect: { id: userId } },
    },
  });

  return savedContent.id;
}

// Handler POST para criar um novo roteiro
export async function POST(request: Request) {
  const parameters = await request.json();
  parameters.webContent = [];

  const token = request.headers.get("Token");
  const userId = await validateToken(token, SECRET);
  if (userId instanceof Response) return userId;

  const optimizedQueries = await generateOptimizedQueries(parameters);

  // Executar as consultas e obter o conteúdo da web
  const webContentResults = await Promise.all(optimizedQueries.map(fetchWebContent));
  parameters.webContent = webContentResults.flat();

  // Gerar o roteiro com base no conteúdo da web e parâmetros
  const studyPlan = await generateStudyPlan(parameters);

  // Salvar o conteúdo gerado no banco de dados
  const savedId = await saveStudyPlan(userId, parameters, studyPlan);

  return new Response(JSON.stringify({ id: savedId }));
}

// Handler GET para buscar o histórico de roteiros
export async function GET(request: Request) {
  const token = request.headers.get("Token");
  const userId = await validateToken(token, SECRET);
  if (userId instanceof Response) return userId;

  const roteiros = await prisma.roteiros.findMany({
    where: { authorId: userId },
  });

  return new Response(JSON.stringify(roteiros));
}
