/* eslint-disable @next/next/no-img-element */
"use client";

import {useState, useEffect} from "react";

import * as HoverCard from "@radix-ui/react-hover-card";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("sophia_token");
    if (!token) {
      window.location.href = "/";
    }
    setToken(token);
    console.log(token);
  }, []);
  return (
    <div className="lg:h-[85vh] h-fit pb-8">
      <div className="h-2/5 min-h-40 flex flex-col md:flex-row relative items-center justify-center gradient-gray text-zinc-100">
        converse com
        <img src="logo_novo_branco.png" alt="" className="h-12 ml-6" />

        {/*<img src="arrow.png" alt="" className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"/>*/}
      </div>
      <section className="h-3/5 pt-4 box-border flex flex-col lg:flex-row items-end justify-between gap-4">
        <div className="box-1">
          <div className="flex flex-col justify-between h-full w-4/5">
            <p className="text-3xl font-bold">
              Corrija seus textos e trabalhos
            </p>
            <p className="text-xl font-semibold">
              Receba um parecer detalhado sobre seu texto, com sugestões de
              melhorias e correções.
            </p>
          </div>
          <div className="w-1/5 h-full flex flex-col justify-between items-center">
            <a href="correcoes"><img src="arrow.png" alt="" className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"/></a>
          </div>
        </div>

        <div className="box-2">
          <div className="flex flex-col justify-between h-full w-4/5">
            <p className="text-3xl font-bold">Gere listas de exercícios</p>
            <p className="text-xl font-semibold">
              Personalizadas e baseadas em seus documentos ou sites de escolha.
            </p>
          </div>
          <div className="w-1/5 h-full flex flex-col justify-between items-center">
            <a href="/exercises">
              <img
                src="arrow.png"
                alt=""
                className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
              />
            </a>
          </div>
        </div>
        <div className="box-3">
          <div className="flex flex-col justify-between h-full w-4/5">
            <p className="text-3xl font-bold">Crie roteiros de estudos</p>
            <p className="text-xl font-semibold">
              Para estudar para provas, vestibulares, concursos ou sobre um assunto de seu interesse.
            </p>
          </div>
          <div className="w-1/5 h-full flex flex-col justify-between items-center">
            <a href="/roteiros"><img src="arrow.png" alt="" className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"/></a>
          </div>
        </div>
      </section>
    </div>
  );
}
