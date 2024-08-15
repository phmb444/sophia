import { Divider } from "@nextui-org/react";

export default function Exercise(exercise: any) {
  const exercicio = exercise.exercise;
  return (
    <div className="p-8 box-4 mb-12">
      <div className="flex justify-between text-xl font-bold mb-4">
        <p className="">Tema: {exercicio.params.tema}</p>
        <p className="mb-2">
          Quantidade de questões: {exercicio.params.quantidade}
        </p>
        <p className="mb-2">Nível de dificuldade: {exercicio.params.nivel}</p>
      </div>
      <Divider className="bg-zinc-300"></Divider>

      {exercicio.content.questions.map((question: any) => (
        <div key={question.question} className="my-4">
          <p className="text-lg font-semibold mb-2">{question.question}</p>
          {question.type === "alternativa" && (
            <ul className="list-disc ml-6 mb-2">
              {Object.entries(question.options).map(([key, value]) => (
                <li key={key}>
                  {key}: {value as React.ReactNode}
                </li>
              ))}
            </ul>
          )}
          <p className="mb-2">Resposta correta: {question.correct_answer}</p>
          <p className="mb-2">Explicação: {question.explanation}</p>
        </div>
      ))}
    </div>
  );
}
