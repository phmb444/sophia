"use client";

import { loginUser } from "./actions";
import { FormEvent } from "react";
import { useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import InfoSection from "@/components/information_section";

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await loginUser(formData);
    if (typeof result === "string") {
      setError(result);
    } else {
      localStorage.setItem("sophia_token", result.token);
      window.location.href = "/home";
    }
  }

  return (
    <div className="md:flex w-screen">
      <main className="md:w-1/2 w-screen h-screen flex flex-col items-center justify-center fundo_login">
        <h1 className="text-3xl font-bold">Bem vindo de volta</h1>
        <h2 className="text-lg font-semibold">Insira seus dados abaixo </h2>
        <form onSubmit={handleSubmit} className="flex flex-col p-4">
          <Input
            type="email"
            className="mt-6"
            id="email"
            name="email"
            placeholder="Enter your email"
          />
          <Input
            className="mt-4"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            
          />
          <Button
            type="submit"
            className="md:w-80 w-60 mt-8 bg-zinc-900 text-zinc-100"
            size="lg"
          >
            Login
          </Button>
          {error && (
            <div className="text-red-600 font-semibold mt-2">{error}</div>
          )}
        </form>
      </main>
      <InfoSection />
    </div>
  );
}
