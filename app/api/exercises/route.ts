import OpenAI from "openai";

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
  const parameters: DataFromUser = await request.json();
  console.log(parameters);

  const response = await openai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-1106:personal:exercise-generator:9pzA0XI9",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de IA feito para gerar exercícios, dado uma entrada do usuário, reponda em JSON uma mensagem contendo os exercicios solicitados e seguindo os requisitos",
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
  } else {
    console.error("Conteúdo da resposta é nulo.");
  }
  return new Response (JSON.stringify(parsedContent.output));
}
