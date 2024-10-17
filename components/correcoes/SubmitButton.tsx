import { Button } from "@nextui-org/react";

interface SubmitButtonProps {
    loading: boolean;
    handleSubmit: () => void;
  }
  
  const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, handleSubmit }) => {
    return (
      <Button isLoading={loading} onPress={handleSubmit} className="btn-gradient mt-6">
        Enviar
      </Button>
    );
  };
  
  export default SubmitButton;
  