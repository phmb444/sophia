'use client'

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

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
            console.log(data);
            setRoteiro(data);
        };
        getRoteiro();
    }, [id]);

    return (
        <div className="markdown-content">
            <ReactMarkdown>{roteiro.content}</ReactMarkdown>
        </div>
    );
}
