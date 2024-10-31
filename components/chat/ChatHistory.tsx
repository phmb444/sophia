import { Button } from '@nextui-org/react';

interface Chat {
  id: string;
  firstMessage: {
    content: string;
  };
}

interface ChatHistoryProps {
  chatHistory: Chat[];
  selectedChatId: string;
  onChatSelect: (id: string) => void;
  isSubmitting: boolean;
  onNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, selectedChatId, onChatSelect, isSubmitting, onNewChat }) => {
  return (
    <div style={{
      width: '30%',
      border: '1px solid #ccc',
      padding: '1rem',
      overflowY: 'auto',
      backgroundColor: '#f5f5f5',
      height: '90vh' // Ensure the height allows for scrolling
    }}>
      <Button onClick={onNewChat} style={{ marginBottom: '1rem' }}>
        New Chat
      </Button>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {chatHistory.map(chat => (
          <li
            key={chat.id}
            onClick={() => !isSubmitting && onChatSelect(chat.id)}
            style={{
              padding: '0.75rem',
              marginBottom: '0.5rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              backgroundColor: selectedChatId === chat.id ? '#e0e0e0' : 'white',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {chat.firstMessage.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
