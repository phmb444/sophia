'use client'

import { Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";
import RoteirosHistoryModal from "@/components/roteiros/roteiros_history_modal";


export default function RoteirosForm() {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [tema, setTema] = useState("");
    const [objetivoAprendizado, setObjetivoAprendizado] = useState("");
    const [nivelConhecimento, setNivelConhecimento] = useState("");
    const [disponibilidadeTempo, setDisponibilidadeTempo] = useState("");
    const [prazo, setPrazo] = useState("");
    const [estiloAprendizagem, setEstiloAprendizagem] = useState("");
    const [materiaisEstudo, setMateriaisEstudo] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("sophia_token");
        if (!token) {
            window.location.href = "/";
        }
        setToken(token);
    }, []);

    async function handleSubmit() {
        if (!tema || !objetivoAprendizado || !nivelConhecimento || !disponibilidadeTempo) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = {
            tema,
            objetivoAprendizado,
            nivelConhecimento,
            disponibilidadeTempo,
            prazo,
            estiloAprendizagem,
            materiaisEstudo,
        };
        
        let test = await fetch("/api/roteiros", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Token: token as string,
            },
            body: JSON.stringify(data),
        });
        if (test.status === 500) {
            setError("Erro interno do servidor, tente novamente");
            setLoading(false);
            return;
          }
        const response = await test.json()
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
                        id="objetivo-aprendizado"
                        name="objetivo-aprendizado"
                        label="Objetivo de aprendizado:"
                        value={objetivoAprendizado}
                        onValueChange={setObjetivoAprendizado}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite o objetivo de aprendizado"
                    />
                    <Input
                        type="text"
                        id="nivel-conhecimento"
                        name="nivel-conhecimento"
                        label="Nível de conhecimento atual:"
                        value={nivelConhecimento}
                        onValueChange={setNivelConhecimento}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite o nível de conhecimento atual"
                    />
                    <Input
                        type="text"
                        id="disponibilidade-tempo"
                        name="disponibilidade-tempo"
                        label="Disponibilidade de tempo:"
                        value={disponibilidadeTempo}
                        onValueChange={setDisponibilidadeTempo}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite a disponibilidade de tempo"
                    />
                    <Input
                        type="text"
                        id="prazo"
                        name="prazo"
                        label="Prazo:"
                        value={prazo}
                        onValueChange={setPrazo}
                      
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite o prazo"
                    />
                    <Input
                        type="text"
                        id="estilo-aprendizagem"
                        name="estilo-aprendizagem"
                        label="Estilo de aprendizagem:"
                        value={estiloAprendizagem}
                        onValueChange={setEstiloAprendizagem}
                 
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite o estilo de aprendizagem"
                    />
                    <Input
                        type="text"
                        id="materiais-estudo"
                        name="materiais-estudo"
                        label="Materiais de estudo preferidos:"
                        value={materiaisEstudo}
                        onValueChange={setMateriaisEstudo}
                  
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Digite os materiais de estudo preferidos"
                    />
                    <Button isLoading={loading} onClick={handleSubmit} className="btn-gradient mt-6">
                        Gerar roteiro
                    </Button>
                    {error ? <p className="text-red-500">{error}</p> : ""}
                </div>
            </main>
        </div>
    );
}