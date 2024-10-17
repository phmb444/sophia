interface ErrorsProps {
    message: string;
  }
  
  export default function Errors({ message }: ErrorsProps) {
    return <p className="text-red-500">{message}</p>;
  }
  