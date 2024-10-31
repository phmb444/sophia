'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@nextui-org/react'
import CorrectionSummary from '@/components/correcoes/CorrectionSummary'
import CorrectionItem from '@/components/correcoes/CorrectionItem'
import RevisionNote from '@/components/correcoes/RevisionNote'
import { CardHeader, CardBody } from '@nextui-org/react'

type CorrectionData = {
    resumoCorrecao: {
        totalErros: number
        categorias: Record<string, number>
        melhoriasSugeridas: string
    }
    correcoes: Array<{
        localizacao: { sessao: string; proximoDe: string }
        frase: string
        erro: { tipo: string; descricao: string }
        sugestao: string
        status: 'corrigido' | 'pendente'
    }>
    notasRevisao: Array<{
        localizacao: { sessao: string; proximoDe: string }
        comentario: string
        sugestao: string
    }>
}

export default function CorrectionResults({ params }: { params: { id: string } }) {
    const [data, setData] = useState<CorrectionData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const id = params.id;

    useEffect(() => {
        const token = localStorage.getItem("sophia_token");
        if (!token) {
          window.location.href = "/";
        }
        setToken(token);
        const getCorrecao = async () => {
          const response = await fetch(`/api/correcao/one?id=${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token, id: id }),
          });
          const data = await response.json();
          setData(data.content);
          setIsLoading(false);
        };
        getCorrecao();
      }, [id]);

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center mb-8">Resultados da Correção</h1>

            {data && <CorrectionSummary summary={data.resumoCorrecao} />}

            <Card>
                <CardHeader>
                    <h3><strong>Correções Detalhadas</strong></h3>
                </CardHeader>
                <CardBody className='space-y-2'>
                    {data?.correcoes && data.correcoes.length > 0 ? (
                        data.correcoes.map((correction, index) => (
                            <CorrectionItem key={index} correction={correction} />
                        ))
                    ) : (
                        <p>Sem correções</p>
                    )}
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <h3><strong>Notas de Revisão</strong></h3>
                </CardHeader>
                <CardBody>
                    {data?.notasRevisao && data.notasRevisao.length > 0 ? (
                        data.notasRevisao.map((note, index) => (
                            <RevisionNote key={index} note={note} />
                        ))
                    ) : (
                        <p>Sem notas de revisão</p>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}
