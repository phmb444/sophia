interface FileListProps {
    files: FileList;
  }
  
  export default function FileList({ files }: FileListProps) {
    return (
      <div>
        <h3>Arquivos enviados:</h3>
        <ul>
          {Array.from(files).map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    );
  }
      