"use client";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Button,
} from "@nextui-org/react";
import { useState } from "react";

export default function QuestaoAlternativa({ questao }: any) {
    const [acertou, setAcertou] = useState(false);
    const [mensagem, setMensagem] = useState("");

    function handleClick(letra: string) {
    
        if (questao.correct_answer === letra) {
      
            setMensagem("Resposta correta!");
            setAcertou(true);
        } else {
 
            setMensagem("Resposta incorreta!");
            setAcertou(false);
        }
    }
    return (
        <>
            <Card className="mb-4">
                <CardHeader className="font-bold">{questao.question}</CardHeader>
                <CardBody>
                    <Divider />
                    <ul className="flex flex-col w-full mt-4 justify-between space-y-4">
                        <li className="flex items-center">
                            <p className={`mr-2 ${acertou && questao.correct_answer === "a" ? "text-green-500" : ""}`}>a)</p>
                            <Button variant={acertou && questao.correct_answer === "a" ? "solid" : "bordered"} onPress={() => handleClick("a")} className={acertou && questao.correct_answer === "a" ? "bg-green-500" : ""}>
                                {questao.options.a}
                            </Button>
                        </li>
                        <li className="flex items-center">
                            <p className={`mr-2 ${acertou && questao.correct_answer === "b" ? "text-green-500" : ""}`}>b)</p>
                            <Button variant={acertou && questao.correct_answer === "b" ? "solid" : "bordered"} onPress={() => handleClick("b")} className={acertou && questao.correct_answer === "b" ? "bg-green-500" : ""}>
                                {questao.options.b}
                            </Button>
                        </li>
                        <li className="flex items-center">
                            <p className={`mr-2 ${acertou && questao.correct_answer === "c" ? "text-green-500" : ""}`}>c)</p>
                            <Button variant={acertou && questao.correct_answer === "c" ? "solid" : "bordered"} onPress={() => handleClick("c")} className={acertou && questao.correct_answer === "c" ? "bg-green-500" : ""}>
                                {questao.options.c}
                            </Button>
                        </li>
                        <li className="flex items-center">
                            <p className={`mr-2 ${acertou && questao.correct_answer === "d" ? "text-green-500" : ""}`}>d)</p>
                            <Button variant={acertou && questao.correct_answer === "d" ? "solid" : "bordered"} onPress={() => handleClick("d")} className={acertou && questao.correct_answer === "d" ? "bg-green-500" : ""}>
                                {questao.options.d}
                            </Button>
                        </li>
                    </ul>
                </CardBody>
                
                <CardFooter className="flex-col items-start">
                    <p className={`text-${acertou ? "green" : "red"}-500`}>
                        {mensagem}
                    </p>

                    {acertou && (
                        <>
                        <Divider className="my-2" />
                            <p className="font-bold">
                                Resposta correta: {questao.correct_answer}
                            </p>
                            <p className="text-sm text-justify">{questao.explanation}</p>
                        </>
                    )}
                </CardFooter>
            </Card>
        </>
    );
}
