'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'
import { Badge, Button, Divider, Chip } from '@nextui-org/react'


// Defina os tipos baseados no JSON fornecido
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

// Componente principal
export default function CorrectionResults({ params }: { params: { id: string } }) {
    const [data, setData] = useState<CorrectionData | null>()
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
          console.log(data.content);
        };
        getCorrecao();
      },[id]);


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center mb-8">Resultados da Correção</h1>

            {data && <CorrectionSummary summary={data.resumoCorrecao} />}

            <Card>
                <CardHeader>
                    <h3><strong>Correções Detalhadas</strong></h3>
                </CardHeader>
                <CardBody className='space-y-2'>
                    {data && data.correcoes.length > 0 ? (
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
                    {data && data.notasRevisao.length > 0 ? (
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

// Componente para o resumo da correção
function CorrectionSummary({ summary }: { summary: CorrectionData['resumoCorrecao'] }) {
    return (
        <Card>
            <CardHeader>
                <h3><strong> Resumo da Correção</strong>
                </h3>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col md:flex-row  justify-between items-start md:items-center mb-4">
                    <span className="text-2xl font-bold">Total de Erros: {summary.totalErros}</span>
                    <div className="space-x-2 my-4 md:my-0 flex flex-col md:flex-row md:items-end items-start">
                        {Object.entries(summary.categorias).map(([category, count]) => (
                            category !== 'estilo' && (
                                <Badge key={category} color="primary" variant="flat">
                                    <strong className='mx-1'>{category === 'precisaoDados' ? 'precisão dos dados' : category}:</strong> {count}
                                </Badge>
                            )
                        ))}
                    </div>
                </div>
                <div className=' py-4  bg-blue-500 text-zinc-50 rounded-lg items-start justify-center px-4 flex flex-col'>
                    <p className='font-semibold'>Melhorias Sugeridas: </p>
                    <p>{summary.melhoriasSugeridas}</p>
                </div>
            </CardBody>
        </Card>
    )
}

// Componente para cada item de correção
function CorrectionItem({ correction }: { correction: CorrectionData['correcoes'][0] }) {
    return (
        <div className="border p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
                <span className=""><strong>Proximo de:</strong>  {correction.localizacao.sessao} - {correction.localizacao.proximoDe}</span>
                <Chip color={correction.status === 'corrigido' ? 'success' : 'danger'}>
                    {correction.status === 'corrigido' ? 'Corrigido' : 'Pendente'}
                </Chip>
            </div>
            <p className="text-sm mb-2 text-muted-foreground"><strong>Trecho: </strong>{correction.frase}</p>
            <Divider ></Divider>
            <div className="bg-muted p-2 rounded text-sm">
                <strong>Erro: </strong> {correction.erro.descricao}
            </div>
            <div className="bg-muted p-2 rounded text-sm">
                <strong>Sugestão:</strong> {correction.sugestao}
            </div>
        </div>
    )
}

// Componente para cada nota de revisão
function RevisionNote({ note }: { note: CorrectionData['notasRevisao'][0] }) {
    return (
        <div className="border p-4 rounded-lg space-y-2">
            <span className="font-semibold">{note.localizacao.sessao} - {note.localizacao.proximoDe}</span>
            <p className="text-sm">{note.comentario}</p>
            <p className="text-sm text-muted-foreground"><strong>Sugestão:</strong> {note.sugestao}</p>
        </div>
    )
}
