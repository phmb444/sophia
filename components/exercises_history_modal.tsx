import { Button } from "@nextui-org/react"
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

export default function ExercisesHistory(){
        const { isOpen, onOpen, onOpenChange } = useDisclosure();
        const [exercises, setExercises] = useState([]);

        useEffect(() => {
                fetch('/api/exercises', {
                        method: 'GET',
                        headers: {
                                'Token': localStorage.getItem("sophia_token") as string,
                        },
                }).then(async (res) => {
                        const data = await res.json();
                        setExercises(data);
                });
        }, []);

        return (
            <>
                <Button className="mb-4 mt-4" onPress={onOpen}>Histórico de exercicios</Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        <ModalHeader>Historico de exercicios</ModalHeader>
                        <ModalBody>
                            {!exercises.length && <p>Nenhum exercicio encontrado</p>}
                            {exercises.map((exercise: any) => (
                                <p key={exercise.id}> <Link href={`/exercises/${exercise.id}`}>{exercise.params.tema}, {exercise.params.quantidade} exercicios, {exercise.params.nivel}, {new Date(exercise.date).toLocaleDateString('pt-BR')} </Link></p>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onOpenChange}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
}