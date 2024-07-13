/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { relative } from "path";

export default function Home() {
  
  return (
    <div className="lg:h-[85vh] h-fit pb-8">
      <div className="h-2/5 min-h-40 flex flex-col md:flex-row relative items-center justify-center gradient-gray text-zinc-100">
        converse com
        <img src="logo_novo_branco.png" alt="" className="h-12 ml-6" />
        <img
          src="arrow.png"
          alt=""
          className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
        />
      </div>
      <section className="h-3/5 pt-4 box-border flex flex-col lg:flex-row items-end justify-between gap-4">
        <div className="box-1">
          <div className="flex flex-col justify-between h-full w-4/5">
            <p className="text-3xl font-bold">
              Corrija seus textos e trabalhos
            </p>
            <p className="text-xl font-semibold">
              Receba sugestões de melhoras na escrita e correção de respostas
              incorretas.
            </p>
          </div>
          <div className="w-1/5 h-full flex flex-col justify-between items-center">
            <HoverCard.Root>
              <HoverCard.Trigger>
                <img
                  src="information.png"
                  alt=""
                  className="hover:scale-110 hover:cursor-pointer transition-all"
                />
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content>
                  <p
                    className=" mt-4 w-60 p-4 h-40 rounded-xl bg-zinc-100 border-2 "
                    style={{
                      boxShadow: "2px 0px 15px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    Receba um parecer com sugestões de mundanças, explicações
                    sobre regras de português e correção de respostas
                    incorretas.
                  </p>
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
            <img
              src="arrow.png"
              alt=""
              className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
            />
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
            <HoverCard.Root>
              <HoverCard.Trigger>
                <img
                  src="information.png"
                  alt=""
                  className="hover:scale-110 hover:cursor-pointer transition-all"
                />
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content>
                  <p
                    className=" mt-4 w-60 p-4 h-40 rounded-xl bg-zinc-100 border-2 "
                    style={{
                      boxShadow: "2px 0px 15px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    Receba um parecer com sugestões de mundanças, explicações
                    sobre regras de português e correção de respostas
                    incorretas.
                  </p>
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
            <img
              src="arrow.png"
              alt=""
              className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
            />
          </div>
        </div>
        <div className="box-3">
          <div className="flex flex-col justify-between h-full w-4/5">
            <p className="text-3xl font-bold">Crie roteiros de estudos</p>
            <p className="text-xl font-semibold">
              Para se estudar para uma prova, vestibular ou concurso.
            </p>
          </div>
          <div className="w-1/5 h-full flex flex-col justify-between items-center">
            <HoverCard.Root>
              <HoverCard.Trigger>
                <img
                  src="information.png"
                  alt=""
                  className="hover:scale-110 hover:cursor-pointer transition-all"
                />
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content>
                  <p
                    className=" mt-4 w-60 p-4 h-40 rounded-xl bg-zinc-100 border-2 "
                    style={{
                      boxShadow: "2px 0px 15px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    Receba um parecer com sugestões de mundanças, explicações
                    sobre regras de português e correção de respostas
                    incorretas.
                  </p>
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
            <img
              src="arrow.png"
              alt=""
              className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
