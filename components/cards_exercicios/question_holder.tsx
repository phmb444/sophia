'use client'
import { Share } from "lucide-react";
import QuestaoAlternativa from "./questao_alternativa"
import QuestaoDissertativa from "./questao_dissertativa"
import { Button } from "@nextui-org/react";


export default function QuestionHolder(questoes: any) {
    return (
        <div className="md:max-w-[60vw] md:w-1/2 w-[90vw]">
            <h1></h1>
            {questoes.questoes.map((questao: any, index: number) => (
                <div key={index}>
                    {questao.type.toLowerCase() === "alternativa" ? (
                        <QuestaoAlternativa questao={questao} index={index} />
                    ) : (
                        <QuestaoDissertativa questao={questao} index={index} />
                    )}
                </div>
            ))}
            <Button color="primary" variant='flat' className='w-full' onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <Share className="w-4 h-4 mr-2" />
                Compartilhar lista de exercicios
            </Button>
        </div>
    );
}