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

// criar roteiro
export async function POST(request: Request) {
  let parameters = await request.json();
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
          "Você é um otimizador de querys, dado parametros crie 3 querys otimizadas para pequisas em um mecanismo de busca como google, faça elas serem curtas com no maximo 10 palavras, responda em um formato semelhante a esse 'When%20was%20Jina%20AI%20founded%3F', De a query em portugues brasileiro. Elas devem estar em um JSON com a propridade querys que deve conter um array com apenas o texto das querys",
      },
      {
        role: "user",
        content: JSON.stringify(parameters),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const querys = JSON.parse(query.choices[0].message.content ?? "");

  for (let i = 0; i < querys.querys.length; i++) {
    querys.querys[i] = querys.querys[i].replace(/ /g, "%20");
  }

  // Executar os fetchs de forma assíncrona e esperar todos serem resolvidos
  const fetchPromises = querys.querys.map(async (query:any) => {
    const busca = `${JINA_URL}${query}`;
    console.log(busca);

    const webContent = await fetch(busca, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JINA_API_KEY}`,
        Accept: "application/json",
      },
    });

    const data = await webContent.json();
    return [data.data[0], data.data[1]];
  });

  // Esperar que todas as requisições sejam resolvidas
  const results = await Promise.all(fetchPromises);

  // Adicionar os resultados ao parameters.webContent
  results.forEach((result) => {
    parameters.webContent.push(...result);
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de IA educacional especializado em gerar roteiros de estudo personalizados. Ao receber uma solicitação de um usuário, responda em formato HTML, estruturando o conteúdo com tópicos e subtópicos relevantes ao tema solicitado. Utilize TailwindCSS para estilizar o HTML, sem adicionar padding ou shadow ao conteúdo. Ao citar fontes, inclua apenas links confiáveis e verificados, evitando mencionar sites ou vídeos cujos links não sejam 100% seguros e válidos. Ajuste a profundidade e o estilo das explicações de acordo com o nível de complexidade necessário, garantindo clareza e organização no conteúdo apresentado. Lembre-se de que você não precisa adicionar os parâmetros no corpo do texto. Forneça um roteiro completo e bem feito, abordando o tema da melhor maneira possível. Não inicie a resposta com ```html, apenas insira o código HTML diretamente. Utilize o texto fornecido dentro do parametro webContent para ajudar a gerar o roteiro e utilize dos links junto ao roteiro. Deixe os links destacados em azul, sublinhados e sempre faça com que eles abram em uma nova guia. A seguir vem uma descrição do que é um roteiro de estudos e quais tópicos você deve prestar atenção: Um roteiro de estudos é um documento que serve para organizar tudo o que você precisa estudar em um determinado prazo, a ordem em que pretende fazer isso e de que modo. A ideia é especificar as disciplinas, exercícios, pesquisas, atividades complementares e quaisquer outras estratégias adotadas para o aprendizado. É importante que o roteiro considere desde a parte teórica, com a leitura do material, até a prática, com exercícios de fixação, pesquisas e a revisão. Dessa maneira, você pode concluir todas as etapas no período disponível para fazer isso. 1. Avalie a sua disponibilidade de tempo. Uma parte essencial do roteiro é especificar quais momentos serão dedicados a quais matérias. Para isso, o primeiro passo é contabilizar quantas horas por dia você vai poder estudar. Se só conseguir fazer isso em um turno, por exemplo, então o roteiro deve ser organizado de acordo com tal disponibilidade de tempo. 2. Determine o que vai estudar Faça uma lista dos conteúdos a serem estudados. Comece pelas disciplinas e, em seguida, passe para os temas abordados em cada uma delas. É interessante ainda verificar quantos capítulos de livro, apostilas, vídeos e outros materiais você tem para estudar. Tal levantamento é útil na organização do cronograma de estudo. 3. Reserve o tempo adequado para cada disciplina. Por falar em cronograma, é crucial que o roteiro de estudos leve em conta a quantidade de tempo que cada disciplina vai exigir. Tenha em mente que não precisa dividir as horas igualmente entre elas, mas sim determinar em quais horários vai estudar cada uma. Então, reserve um período maior para as que apresentam um volume de material mais extenso ou as que considera mais impactantes. 4. Verifique o que é prioridade Além de levar em conta a quantidade de conteúdo de cada matéria, considere quais são as prioridades ao organizar o roteiro. Por exemplo, se você tem mais dificuldade com uma disciplina do que com outra, dedique mais tempo a ela. Já caso esteja em um curso e as provas estejam próximas, estude os assuntos de acordo com a urgência. 5. Deixe os materiais separados Uma atitude que vai facilitar a rotina de estudos é deixar os materiais já separados. Você pode organizar por dia, por semana ou como achar melhor. O importante é não perder tempo no momento de começar as atividades do dia. Tal cuidado torna o processo mais ágil para que você possa focar o que realmente interessa. 6. Organize o restante da sua rotina O cumprimento do roteiro de estudos se torna muito mais viável quando o resto da sua rotina está em ordem.Por esse motivo, tente estabelecer os horários para as suas demais atividades. Desse modo, você não vai ter de se ocupar com outras coisas nos períodos em que deveria estudar para atingir os seus objetivos. 7. Separe tempo para descanso e lazer Um bom aproveitamento nos estudos depende, também, de você conseguir descansar e ter momentos de diversão. Em meio à rotina corrida, pode até parecer desperdício de tempo, mas isso é imprescindível para manter a saúde mental e a energia necessárias para se dedicar aos estudos com a intensidade que precisa. 8. Escolha um formato para o roteiro de estudos Para acompanhar o roteiro no dia a dia, você pode registrá-lo em uma agenda, por exemplo. Algumas pessoas preferem uma planilha no computador, o que facilita na hora de fazer ajustes.Outra opção é montar um cartaz que pode ficar pendurado na parede do seu local de estudos para não se esquecer de observar o progresso. 9. Estabeleça metas Para quem está na escola ou na faculdade, as datas das avaliações servem como metas no roteiro de estudos. Quando o objetivo é se preparar para o Enem ou o vestibular, por outro lado, ter vários meses pela frente pode dar a impressão errada de que há tempo de sobra.Por essa razão, é fundamental definir metas para concluir cada disciplina e se esforçar para alcançá-las. Desse modo, você vai manter um ritmo consistente de estudos e não vai se sobrecarregar para conseguir estudar tudo o que precisa antes do final do prazo.",
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

  const uuid = uuidv4();

  const savedContent = await prisma.roteiros.create({
    data: {
      id: uuid,
      v: 1,
      date: new Date(),
      params: parameters,
      content: contentToSave ?? "", // Provide a default value if contentToSave is undefined
      author: {
        connect: { id: id },
      },
    },
  });
  return new Response(JSON.stringify({ id: savedContent.id }));
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
