"use client";

import { FormEvent } from "react";
import { useState } from "react";
import InfoSection from "@/components/information_section";
import { set } from "mongoose";
import { Button } from "@nextui-org/react";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });
    const data = await result.json();
    if (data.msg === "Usuário registrado com sucesso") {
      localStorage.setItem("sophia_token", data.token);
      window.location.href = "/home";
    } else {
      setError(data.msg);
      setLoading(false);
    }
  }

  return (
    <div className="flex w-screen">
      <main className="w-full h-screen flex flex-col items-center justify-center fundo_login">
        <a href="/"><img src="/logo_novo_branco.png" alt="" width={250} className="mb-12" /></a>
        <h1 className="text-3xl font-bold">Bem vindo</h1>
        <h2 className="text-lg font-semibold">Insira seus dados abaixo </h2>
        <form onSubmit={handleSubmit} className="flex flex-col p-4">
          <label htmlFor="name" className="font-bold">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input_text w-80"
          />
          <label htmlFor="email" className="font-bold mt-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input_text w-80"
          />
          <label htmlFor="password" className="font-bold mt-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="input_text w-80"
          />
          <label htmlFor="dob" className="font-bold mt-2">
            Data de nascimento
          </label>
          <input type="date" id="dob" name="dob" className="input_text w-80" />
          <Button isLoading={loading} type="submit" className="button mt-6">
            Registrar-se
          </Button>
        </form>
        {error && (
          <div className="text-red-600 font-semibold mt-2">{error}</div>
        )}
      </main>
    </div>
  );
}
