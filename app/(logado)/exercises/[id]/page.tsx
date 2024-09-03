'use client'
import { set } from "mongoose";
import { useEffect, useState, useCallback } from "react";

import QuestionHolder from "@/components/cards_exercicios/question_holder";
import { Chip } from "@nextui-org/react";

export default function ExerciseView({ params }: { params: { id: string } }) {
    const [exercise, setExercise] = useState<any | "">("");
    const [token, setToken] = useState<string | null>(null);
    
    const id = params.id;
    useEffect(() => {
      const token = localStorage.getItem("sophia_token");
      if (!token) {
        window.location.href = "/";
      }
      setToken(token);
      const getExercise = async () => {
        const response = await fetch(`/api/exercises/one?id=${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token, id: id }),
        });
        const data = await response.json();
        setExercise(data);
      };
      getExercise();
    },[id]);
    return (
      <main className="w-full flex flex-col items-center">
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-4">
      {exercise ? (
        <Chip color="primary" className="mb-4 md:max-w-[60vw]">
        Tema: {exercise.params.tema}
        </Chip>
      ) : (
        ""
      )}
      {exercise ? (
        <Chip color="secondary" className="mb-4 md:max-w-[60vw]">
        Nível de ensino: {exercise.params.nivel}
        </Chip>
      ) : (
        ""
      )}
      {exercise ? (
        <Chip color="warning" className="mb-4 text-white md:max-w-[60vw]">
        Quantidade: {exercise.params.quantidade}
        </Chip>
      ) : (
        ""
      )}
      </div>
      {exercise ? (
        <QuestionHolder questoes={exercise.content.questions} />
      ) : (
        "Carregando..."
      )}
      </main>
    );
  }