'use client'

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Chip } from "@nextui-org/react";

export default function RoteiroView({ params }: { params: { id: string } }) {
    const [roteiro, setRoteiro] = useState<any | "">("");

    const id = params.id;

    useEffect(() => {
        const token = localStorage.getItem("sophia_token");
        if (!token) {
            window.location.href = "/";
        }
        const getRoteiro = async () => {
            const response = await fetch(`/api/roteiros/one`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Token: token as string,
                },
                body: JSON.stringify({ id: id }),
            });
            const data = await response.json();
            setRoteiro(data);
        };
        getRoteiro();
    }, [id]);

    return (
        <main className="w-full flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-4">
                {roteiro ? (
                    <Chip color="primary" className="mb-4 md:max-w-[60vw]">
                        Tema: {roteiro.params.tema}
                    </Chip>
                ) : (
                    ""
                )}
                {roteiro ? (
                    <Chip color="secondary" className="mb-4 md:max-w-[60vw]">
                        Objetivo: {roteiro.params.objetivoAprendizado}
                    </Chip>
                ) : (
                    ""
                )}
                {roteiro ? (
                    <Chip color="warning" className="mb-4 text-white md:max-w-[60vw]">
                        Conhecimento previo: {roteiro.params.nivelConhecimento}
                    </Chip>
                ) : (
                    ""
                )}
            </div>
            {roteiro ? (
                <div className="md:max-w-[60vw] md:w-1/2 w-[90vw] box-border p-8 box-4">
                <div dangerouslySetInnerHTML={{ __html: roteiro.content }}></div>
                </div>
            ) : (
                "Carregando..."
            )}
        </main>
    );
}
