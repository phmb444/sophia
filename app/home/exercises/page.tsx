'use client'

import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { FormEvent } from "react";


export default function Exercises() {

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  }

  return (
    <div className="overflow-x-hidden relative w-full flex flex-col items-center">
      <Button className="mb-4 button">Mostrar exercicios anteriores</Button>
      <main className="md:w-[45vw] min-h-fit box-4 px-16 py-14 mb-12">
        <h1 className="text-4xl font-semibold">Nova lista de exercícios</h1>
        <Divider className="my-4 gradient-divider"></Divider>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            id="tema"
            name="tema"
            label="Tema:"
            isRequired
            labelPlacement="outside"
            variant="bordered"
            placeholder="Insira o tema dos exercicios"
          />
          <Input
            type="number"
            id="quantidade"
            name="quantidade"
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
            <input id="file-upload" type="file" className="hidden" multiple />
          </label>
          <Button type="submit" className="btn-gradient mt-6">Gerar exercícios</Button>
        </form>
      </main>
    </div>
  );
}
