import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Link,
} from "@nextui-org/react";

export default function RoteirosHistoryModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [roteiros, setRoteiros] = useState([]);

    useEffect(() => {
        fetch('/api/roteiros', {
            method: 'GET',
            headers: {
                'Token': localStorage.getItem("sophia_token") as string,
            },
        }).then(async (res) => {
            const data = await res.json();
            setRoteiros(data);
        });
    }, []);

    return (
        <>
            <Button className="mb-4 mt-4" onPress={onOpen}>Histórico de roteiros</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>Histórico de roteiros</ModalHeader>
                    <ModalBody>
                        {!roteiros.length && <p>Nenhum roteiro encontrado</p>}
                        {roteiros.map((roteiro: any) => (
                            <p key={roteiro.id}> <Link href={`/roteiros/${roteiro.id}`}>{roteiro.params.tema}, {roteiro.params.nivel}, {roteiro.params.estudandoPara}, {new Date(roteiro.date).toLocaleDateString('pt-BR')} </Link></p>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={onOpenChange}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}