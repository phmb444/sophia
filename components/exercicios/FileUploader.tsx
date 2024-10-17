interface FileUploaderProps {
    setFiles: (files: FileList | null) => void;
    setFileError: (error: string) => void;
  }
  
  export default function FileUploader({ setFiles, setFileError }: FileUploaderProps) {
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files;
      if (files) {
        let isValid = true;
        for (let i = 0; i < files.length; i++) {
          if (files[i].type !== "application/pdf") {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          setFiles(files);
          setFileError("");
        } else {
          setFiles(null);
          setFileError("Only PDF files are allowed.");
        }
      }
    }
  
    return (
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <p className="text-center text-sm text-gray-600">
          Arraste e solte seus arquivos aqui, ou{" "}
          <span className="text-blue-500 text-sm underline">clique para selecionar</span>
        </p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
        />
      </label>
    );
  }
  