'use client'

import { useState, useEffect } from "react";
import ExercisesHistory from "@/components/exercicios/ExercisesHistory";
import ExercisesForm from "@/components/exercicios/ExercisesForm";
import Errors from "@/components/exercicios/Errors";

export default function Exercises() {
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tema, setTema] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("");
  const [nivel, setNivel] = useState<string>("");
  const [tipos, setTipos] = useState<string[]>(["Alternativas"]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sophia_token");
    if (!token) {
      window.location.href = "/";
    }
    setToken(token);
  }, []);

  const handleSubmit = async () => {
    if (!tema || !quantidade || !nivel || tipos.length === 0) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }
    setLoading(true);

    let requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: token as string,
      },
      body: JSON.stringify({
        tema,
        quantidade,
        nivel,
        tipos,
      }),
    };

    if (files) {
      const formData = new FormData();
      formData.append("tema", tema);
      formData.append("quantidade", quantidade);
      formData.append("nivel", nivel);
      formData.append("tipos", JSON.stringify(tipos));

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      requestOptions = {
        method: "PUT",
        headers: {
          Token: token as string,
        },
        body: formData,
      };
    }

    try {
      const response = await fetch("/api/exercises", requestOptions);

      if (response.status === 500) {
        setError("Erro interno do servidor, tente novamente");
        setLoading(false);
        return;
      }

      const data = await response.json();
      window.location.href = `/exercises/${data.id}`;
    } catch (error) {
      setError("Erro na comunicação com o servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden relative w-full flex flex-col items-center">
      <ExercisesHistory />
      <main className="md:w-[45vw] min-h-fit box-4 px-16 py-14 mb-12">
        <h1 className="text-4xl font-semibold">Nova lista de exercícios</h1>
        <ExercisesForm
          tema={tema}
          setTema={setTema}
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          nivel={nivel}
          setNivel={setNivel}
          tipos={tipos}
          setTipos={setTipos}
          files={files}
          setFiles={setFiles}
          fileError={fileError}
          setFileError={setFileError}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        {error && <Errors message={error} />}
      </main>
    </div>
  );
}
