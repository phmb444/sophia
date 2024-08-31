'use client'

import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";
import RoteirosHistoryModal from "@/components/roteiros_history_modal";


export default function RoteirosForm() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tema, setTema] = useState("");
    const [nivel, setNivel] = useState("");
    const [estudandoPara, setEstudandoPara] = useState("");
    const [formaDeEscrita, setFormaDeEscrita] = useState("");
    const [requisitosAdicionais, setRequisitosAdicionais] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("sophia_token");
        if (!token) {
            window.location.href = "/";
        }
        setToken(token);
    }, []);

    async function handleSubmit() {
        setLoading(true);
        const data = {
            tema,
            nivel,
            estudandoPara,
            formaDeEscrita,
            requisitosAdicionais,
        };
        let test = await fetch("/api/roteiros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Token: token as string,
            },
            body: JSON.stringify(data),
        });
        let response = await test.json();
        window.location.href = `/roteiros/${response.id}`;
    }

    return (
        <div className="overflow-x-hidden relative w-full flex flex-col items-center">
            <RoteirosHistoryModal />
            <main className="md:w-[45vw] mt-8 min-h-fit box-4 px-16 py-14 mb-12">
                <h1 className="text-4xl font-semibold">Novo Roteiro de estudos</h1>
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
                        placeholder="Insira o tema dos exercícios"
                    />
                    <Input
                        type="text"
                        id="nivel"
                        name="nivel"
                        label="Nível de aprofundamento:"
                        value={nivel}
                        onValueChange={setNivel}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite o nível de aprofundamento"
                    />
                    <Input
                        type="text"
                        id="estudando-para"
                        name="estudando-para"
                        label="Estudando para:"
                        value={estudandoPara}
                        onValueChange={setEstudandoPara}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite para que está estudando"
                    />
                    <Input
                        type="text"
                        id="forma-de-escrita"
                        name="forma-de-escrita"
                        label="Forma de escrita:"
                        value={formaDeEscrita}
                        onValueChange={setFormaDeEscrita}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite a forma de escrita"
                    />
                    <Input
                        type="text"
                        id="requisitos-adicionais"
                        name="requisitos-adicionais"
                        label="Requisitos adicionais:"
                        value={requisitosAdicionais}
                        onValueChange={setRequisitosAdicionais}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite os requisitos adicionais"
                    />
                    <Button isLoading={loading} onClick={handleSubmit} className="btn-gradient mt-6">
                        Gerar exercícios
                    </Button>
                </div>
            </main>
        </div>
    );
}