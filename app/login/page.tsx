/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent } from "react";
import { useState,useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import InfoSection from "@/components/information_section";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("sophia_token");
    if (token) {
      window.location.href = "/home";
    }
  }, []);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await fetch("/api/login", {
      method: "POST",
      body: formData,
    }).then((response) => response.json());
    
    if (typeof result === "string") {
      setError(result);
    } else {
      localStorage.setItem("sophia_token", result.token);
      window.location.href = "/home";
    }
  }

  return (
    <div className="md:flex w-screen">
      <main className=" w-screen h-screen flex flex-col items-center justify-center fundo_login">
        <img src="/logo_novo_branco.png" alt="" width={250} className="mb-12" />
        <h1 className="text-3xl font-bold">Bem vindo de volta</h1>
        <h2 className="text-lg font-semibold">Insira seus dados abaixo </h2>
        <form onSubmit={handleSubmit} className="flex flex-col p-4">
          <Input
            type="email"
            className="mt-6"
            id="email"
            name="email"
            placeholder="Insira seu email"
          />
          <Input
            className="mt-4"
            type="password"
            id="password"
            name="password"
            placeholder="Insira sua senha"
          />
          <Button
            type="submit"
            className="md:w-80 w-60 mt-8 bg-zinc-900 text-zinc-100"
            size="lg"
          >
            Entrar
          </Button>
          {error && (
            <div className="text-red-600 font-semibold mt-2">{error}</div>
          )}
        </form>
      </main>
    </div>
  );
}
