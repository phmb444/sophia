/* eslint-disable @next/next/no-img-element */
import { Button } from "@nextui-org/react";

export default function Landing() {
  return (
    <div className="h-screen md:flex bg-zinc-900">
      <main className="h-4/5 text-white md:font-extrabold font-semibold p-8 flex flex-col justify-center md:h-screen md:w-3/5">
        <p className="text-3xl md:text-5xl">conheça</p>
        <img src="/logo_novo_branco.png" alt="logo" />
        <p className="text-3xl mt-4 md:text-4xl">
          uma inteligência artificial educacional
        </p>
      </main>
      <section className="fundo_main h-1/5 rounded-t-3xl md:rounded-none flex flex-col justify-center items-center md:h-screen md:w-2/5">
        <p className="text-zinc-100 font-bold text-3xl">Vamos começar</p>
        <div className="flex justify-center w-full mt-12">
          <a href="/login" >
          <Button className="mr-8 w-40 bg-zinc-100" size="lg">entrar</Button>
            
          </a>
          <a href="/register">
          <Button className="w-40 bg-zinc-100" size="lg">registrar-se</Button>
          </a>
        </div>
      </section>
    </div>
  );
}
