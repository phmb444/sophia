import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

export default function Exercises() {
  return (
    <div className="overflow-x-hidden relative w-full flex flex-col items-center">
      <Button className="mb-4 button">Mostrar exercicios anteriores</Button>
      <main className="md:w-[45vw] md:h-[100vh] box-4 px-16 py-20">
        <h1 className="text-4xl font-semibold">Nova lista de exercícios</h1>
        <Divider className="my-4 gradient-divider"></Divider>
        <form action="" className="flex flex-col gap-4">
          <Input
            type="text"
            label="Tema"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Insira o tema dos exercicios"
          />
          <Input
            type="number"
            label="Quantidade de questões"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Digite a quantidade de questões"
          />
        </form>
      </main>
    </div>
  );
}
