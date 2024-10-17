interface FileUploadProps {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileError: string;
    files: FileList | null;
  }
  
  const FileUpload: React.FC<FileUploadProps> = ({ handleFileChange, fileError, files }) => {
    return (
      <div>
        <p className="text-sm">Envie seu arquivo a ser corrigido</p>
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
        {fileError && <p className="text-red-500">{fileError}</p>}
        {files && (
          <div>
            <h3>Arquivos enviados:</h3>
            <ul>
              {Array.from(files).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default FileUpload;
  