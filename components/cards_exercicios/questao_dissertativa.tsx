import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Button,
    Textarea,
} from "@nextui-org/react";
import { use, useState } from "react";


export default function QuestaoDissertativa({ questao }: any) {
    const [acertou, setAcertou] = useState(false);
    const [esperandoResposta, setEsperandoResposta] = useState(false);
    const [nota, setNota] = useState(0);
    const [mensagem, setMensagem] = useState("")
    const [resposta, setResposta] = useState("")

    async function handleSubmit() {
        setEsperandoResposta(true);
        const response = await fetch("/api/exercises/dissertative", {
            method: "POST",
            body: JSON.stringify({
                questao: questao.question,
                resposta_correta: questao.answer,
                resposta_usuario: resposta,
            }),
        });
        const data = await response.json();
        console.log(data);
        setAcertou(data.acertou);
        setMensagem(data.mensagem);
        setNota(data.nota);
        setEsperandoResposta(false);
    }

    return (
        <Card className="mb-4">
            <CardHeader className="font-bold">{questao.question}</CardHeader>
            <CardBody>
                <Divider className="mb-4" />
                <Textarea
                    variant="bordered"
                    placeholder="Digite sua resposta aqui"
                    value={resposta}
                    onValueChange={setResposta}
                />
                <Button isDisabled={acertou} isLoading={esperandoResposta} onPress={handleSubmit} color='secondary' className="mt-4">Enviar resposta</Button>
            </CardBody>
            <CardFooter className="flex-col items-start">
                <Divider className="mb-4" />
                {esperandoResposta && <p>Estamos verificando sua resposta...</p>}
                {nota != 0 && <p>Nota: {nota}/5</p>}
                {acertou ? <p className="text-green-400">{mensagem}</p> : <p className="text-red-400">{mensagem}</p>}
            </CardFooter>
        </Card>
    )
}