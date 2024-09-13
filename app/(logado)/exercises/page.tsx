'use client'

import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";
import ExercisesHistory from "@/components/exercises_history_modal";



export default function Exercises() {
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tema, setTema] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nivel, setNivel] = useState("");
  const [tipos, setTipos] = useState(["Alternativas"]);
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("sophia_token");
    if (!token) {
      window.location.href = "/";
    }
    setToken(token);
  }, []);


  async function handleSubmit() {
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
  }


  const [fileError, setFileError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      let isValid = true;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== "application/pdf") {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        setFiles(files);
        setFileError("");
      } else {
        setFiles(null);
        setFileError("Only PDF files are allowed.");
      }
    }
  }

  return (
    <div className="overflow-x-hidden relative w-full flex flex-col items-center">
      <ExercisesHistory></ExercisesHistory>
      <main className="md:w-[45vw] min-h-fit box-4 px-16 py-14 mb-12">
        <h1 className="text-4xl font-semibold">Nova lista de exercícios</h1>
        <Divider className="my-4 gradient-divider"></Divider>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            id="tema"
            name="tema"
            label="Tema:"
            value={tema}
            onValueChange={setTema}
            isRequired
            labelPlacement="outside"
            variant="bordered"
            placeholder="Insira o tema dos exercicios"
          />
          <Input
            type="number"
            id="quantidade"
            name="quantidade"
            value={quantidade}
            onValueChange={setQuantidade}
            label="Quantidade de questões:"
            isRequired
            labelPlacement="outside"
            variant="bordered"
            placeholder="Digite a quantidade de questões"
          />
          <Input
            type="text"
            id="nivel"
            name="nivel"
            value={nivel}
            onValueChange={setNivel}
            label="Nível de escolaridade"
            isRequired
            labelPlacement="outside"
            variant="bordered"
            placeholder="Digite o nível de escolaridade para nivelar a dificuldade"
          />
          <CheckboxGroup
            label="Tipos das questões"
            orientation="horizontal"
            isRequired
            value={tipos}
            onValueChange={setTipos}
            color="primary"
            defaultValue={["Alternativas"]}
          >
            <Checkbox className="mr-4" value="Alternativas">
              Alternativas
            </Checkbox>
            <Checkbox value="Dissertativas">Dissertatvas</Checkbox>
          </CheckboxGroup>
          <p className="text-sm">
            Envie arquivos para serem utilizados como contexto e inspiração
          </p>
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <p className="text-center text-sm text-gray-600">
              Arraste e solte seus arquivos aqui, ou{" "}
              <span className="text-blue-500 text-sm underline">
                clique para selecionar
              </span>
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
          {fileError && <p className="text-red-500">{fileError}</p>}
          {files && (
            <div>
              <h3>Arquivos enviados:</h3>
              <ul>
                {Array.from(files).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <Button isLoading={loading} onClick={handleSubmit} className="btn-gradient mt-6">
            Gerar exercícios
          </Button>
          {error ? <p className="text-red-500">{error}</p> : ""}
        </div>
      </main>
    </div>
  );
}
