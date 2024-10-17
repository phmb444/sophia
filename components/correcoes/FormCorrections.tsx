import { Divider } from "@nextui-org/react";
import TextInput from "./TextInput";
import FileUpload from "./FileUpload";
import SubmitButton from "./SubmitButton";

interface CorrectionsFormProps {
  texto: string;
  setTexto: (value: string) => void;
  files: FileList | null;
  fileError: string;
  loading: boolean;
  error: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const CorrectionsForm: React.FC<CorrectionsFormProps> = ({
  texto,
  setTexto,
  files,
  fileError,
  loading,
  error,
  handleFileChange,
  handleSubmit
}) => {
  return (
    <main className="md:w-[45vw] mt-8 min-h-fit box-4 px-16 py-14 mb-12">
      <h1 className="text-4xl font-semibold">Corrigir texto ou arquivo</h1>
      <Divider className="my-4 gradient-divider"></Divider>
      <div className="flex flex-col gap-4">
        <TextInput texto={texto} setTexto={setTexto} />
        <FileUpload handleFileChange={handleFileChange} fileError={fileError} files={files} />
        <SubmitButton loading={loading} handleSubmit={handleSubmit} />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </main>
  );
};

export default CorrectionsForm;
