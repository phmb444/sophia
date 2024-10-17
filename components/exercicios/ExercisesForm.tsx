import { Button, Divider, Input, CheckboxGroup, Checkbox } from "@nextui-org/react";
import FileUploader from "./FileUploader";
import FileList from "./FileList";

interface ExercisesFormProps {
  tema: string;
  setTema: (tema: string) => void;
  quantidade: string;
  setQuantidade: (quantidade: string) => void;
  nivel: string;
  setNivel: (nivel: string) => void;
  tipos: string[];
  setTipos: (tipos: string[]) => void;
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  fileError: string;
  setFileError: (error: string) => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function ExercisesForm({
  tema,
  setTema,
  quantidade,
  setQuantidade,
  nivel,
  setNivel,
  tipos,
  setTipos,
  files,
  setFiles,
  fileError,
  setFileError,
  handleSubmit,
  loading,
}: ExercisesFormProps) {
  return (
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
        type="number"
        id="quantidade"
        name="quantidade"
        value={quantidade}
        onValueChange={setQuantidade}
        label="Quantidade de questões:"
        isRequired
        labelPlacement="outside"
        variant="bordered"
        placeholder="Digite a quantidade de questões"
      />
      <Input
        type="text"
        id="nivel"
        name="nivel"
        value={nivel}
        onValueChange={setNivel}
        label="Nível de escolaridade"
        isRequired
        labelPlacement="outside"
        variant="bordered"
        placeholder="Digite o nível de escolaridade"
      />
      <CheckboxGroup
        label="Tipos das questões"
        orientation="horizontal"
        isRequired
        value={tipos}
        onValueChange={setTipos}
        color="primary"
        defaultValue={["Alternativas"]}
      >
        <Checkbox className="mr-4" value="Alternativas">Alternativas</Checkbox>
        <Checkbox value="Dissertativas">Dissertativas</Checkbox>
      </CheckboxGroup>
      <FileUploader setFiles={setFiles} setFileError={setFileError} />
      {fileError && <p className="text-red-500">{fileError}</p>}
      {files && <FileList files={files} />}
      <Button isLoading={loading} onClick={handleSubmit} className="btn-gradient mt-6">
        Gerar exercícios
      </Button>
    </div>
  );
}
