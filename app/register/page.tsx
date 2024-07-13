"use client";

import { registerUser } from "./actions";
import { FormEvent } from "react";
import { useState } from "react";
import InfoSection from "@/components/information_section";

export default function Register() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await registerUser(formData);
    console.log(result);
    setError(result);
  }

return (
    <div className="flex w-screen">
        <main className="w-1/2 h-screen flex flex-col items-center justify-center fundo_login">
            <h1 className="text-3xl font-bold">Bem vindo de volta</h1>
            <h2 className="text-lg font-semibold">Insira seus dados abaixo </h2>
            <form onSubmit={handleSubmit} className="flex flex-col p-4">
                <label htmlFor="name" className="font-bold">Nome</label>
                <input type="text" id="name" name="name" className="input_text w-80" />
                <label htmlFor="email" className="font-bold mt-2">Email</label>
                <input type="email" id="email" name="email" className="input_text w-80" />
                <label htmlFor="password" className="font-bold mt-2">Senha</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="input_text w-80"
                />
                <label htmlFor="dob" className="font-bold mt-2">Data de nascimento</label>
                <input type="date" id="dob" name="dob" className="input_text w-80" />
                <button type="submit" className="button mt-6">
                    Registrar-se
                </button>
            </form>
            {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        </main>
        <InfoSection />
    </div>
);
}
