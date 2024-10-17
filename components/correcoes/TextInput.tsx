import { Textarea } from "@nextui-org/react";

interface TextInputProps {
    texto: string;
    setTexto: (value: string) => void;
  }
  
  const TextInput: React.FC<TextInputProps> = ({ texto, setTexto }) => {
    return (
      <Textarea
        id="texto"
        name="texto"
        label="Texto:"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Insira seu texto aqui"
        rows={6}
        variant="bordered"
        labelPlacement="outside"
      />
    );
  };
  
  export default TextInput;
  