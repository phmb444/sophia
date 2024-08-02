'use client'

import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { DataFromUser } from "@/app/api/exercises/route";


export default function Exercises() {
  const [tema, setTema] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nivel, setNivel] = useState("");
  const [tipos, setTipos] = useState(["Alternativas"]);
  const [files, setFiles] = useState<FileList | null>(null);  


  async function handleSubmit() {
    const data: DataFromUser = {
      tema,
      quantidade,
      nivel,
      tipos,
    };
    let test = await fetch ('/api/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let response = await test.json();
    console.log(response);
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
      <Button className="mb-4 button">Mostrar exercicios anteriores</Button>
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
          <Button onClick={handleSubmit} className="btn-gradient mt-6">
            Gerar exercícios
          </Button>
        </div>
      </main>
    </div>
  );
}
