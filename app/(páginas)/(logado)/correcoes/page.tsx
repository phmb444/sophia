'use client'

import { useState, useEffect } from "react";
import CorrectionsHistory from "@/components/correcoes/CorrecoesHistory";
import CorrectionsForm from "@/components/correcoes/FormCorrections";

export default function Correcoes() {
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
                const data = await response.json();
                window.location.href = `/correcoes/${data.id}`;
            } else {
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
            <CorrectionsHistory />
            <CorrectionsForm
                texto={texto}
                setTexto={setTexto}
                files={files}
                fileError={fileError}
                loading={loading}
                error={error}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}
