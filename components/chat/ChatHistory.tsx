import { useState } from 'react';
import { Button } from '@nextui-org/react';

interface Chat {
  title: string;
  id: string;
  date: string;
}

interface ChatHistoryProps {
  chatHistory: Chat[];
  selectedChatId: string;
  onChatSelect: (id: string) => void;
  isSubmitting: boolean;
  onNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  selectedChatId,
  onChatSelect,
  isSubmitting,
  onNewChat,
}) => {
  const [visibleChats, setVisibleChats] = useState(10);

  const handleLoadMore = () => {
    setVisibleChats((prev) => prev + 10);
  };

  const displayedChats = chatHistory.slice(0, visibleChats);

  return (
    <div className="w-1/3 border border-gray-300 p-4 overflow-y-auto bg-gray-100 h-[90vh]">
      <Button color='secondary' onClick={onNewChat} className="mb-4 w-full">
        New Chat
      </Button>
      {chatHistory.length === 0 ? (
        <div className="text-center text-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Carregando...
        </div>
      ) : (
        <>
          <ul className="list-none p-0 m-0">
            {displayedChats.map((chat) => (
                <li
                key={chat.id}
                onClick={() => !isSubmitting && onChatSelect(chat.id)}
                className={`py-3 px-3 mb-2 cursor-${
                  isSubmitting ? 'not-allowed' : 'pointer'
                } ${
                  selectedChatId === chat.id ? 'bg-gray-300' : 'bg-white'
                } rounded transition-colors duration-200 opacity-${isSubmitting ? '70' : '100'} shadow-sm`}
                >
                {chat.title}
                <div className="text-gray-500 text-sm mt-1">
                  {new Date(chat.date).toLocaleDateString('pt-BR')}
                </div>
                </li>
            ))}
          </ul>
          {visibleChats < chatHistory.length && (
            <Button onClick={handleLoadMore} className="mt-4 w-full">
              Ver Mais
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ChatHistory;
