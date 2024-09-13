'use client'

import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import CorrectionsHistory from "@/components/correcao_history_modal";

export default function UploadPage() {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [texto, setTexto] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [fileError, setFileError] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("sophia_token");
        if (!token) {
            window.location.href = "/";
        }
        setToken(token);
    }, []);


    async function handleSubmit() {
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("texto", texto);
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("files", files[i]);
                }
            }

            const response = await fetch("/api/correcao", {
                method: "POST",
                headers: {
                    "Token": token as string,
                },
                body: formData,
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                window.location.href = `/correcoes/${data.id}`;
            } else {
                // Handle error response
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError("Erro interno do servidor");
        }

        setLoading(false);
    }


    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files) {
            let isValid = true;
            for (let i = 0; i < files.length; i++) {
                if (files[i].type !== "application/pdf") {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                setFiles(files);
                setFileError("");
            } else {
                setFiles(null);
                setFileError("Only PDF files are allowed.");
            }
        }
    }

    return (
        <div className="overflow-x-hidden relative w-full flex flex-col items-center">
            <CorrectionsHistory></CorrectionsHistory>
            <main className="md:w-[45vw] mt-8 min-h-fit box-4 px-16 py-14 mb-12">
                <h1 className="text-4xl font-semibold">Corrigir texto ou arquivo</h1>
                <Divider className="my-4 gradient-divider"></Divider>
                <div className="flex flex-col gap-4">
                    <Textarea
                        id="texto"
                        name="texto"
                        label="Texto:"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Insira seu texto aqui"
                        rows={6}
                        variant="bordered"
                        labelPlacement="outside"
                    />
                    <p className="text-sm">
                        Envie seu arquivo a ser corrigido
                    </p>
                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <p className="text-center text-sm text-gray-600">
                            Arraste e solte seus arquivos aqui, ou{" "}
                            <span className="text-blue-500 text-sm underline">
                                clique para selecionar
                            </span>
                        </p>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            multiple
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </label>
                    {fileError && <p className="text-red-500">{fileError}</p>}
                    {files && (
                        <div>
                            <h3>Arquivos enviados:</h3>
                            <ul>
                                {Array.from(files).map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button isLoading={loading} onPress={handleSubmit} className="btn-gradient mt-6">
                        Enviar
                    </Button>
                    {error ? <p className="text-red-500">{error}</p> : ""}
                </div>
            </main>
        </div>
    );
}
