/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Button, ScrollShadow } from '@nextui-org/react';

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
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  selectedChatId,
  onChatSelect,
  isSubmitting,
  onNewChat,
  isCollapsed,
  setIsCollapsed,
}) => {
  return (
    <div className="w-full max-w-[82vw] md:w-64  bg-white rounded-3xl overflow-hidden dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Histórico</h2>
        <Button isIconOnly variant="light" onClick={() => setIsCollapsed(true)}>
          <img src="/arrows-in-line-horizontal.svg" alt="" />
        </Button>
      </div>
      <div className="pt-4 px-2 space-y-2 h-[calc(100vh-60px)]">
        <Button color="secondary" onClick={onNewChat} className="bg-gradient-to-r w-full max-w-[82vw] from-purple-600 to-pink-500 text-white shadow-lg ">
          Novo chat
        </Button>
        {chatHistory.length === 0 ? (
          <div className="text-center text-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Carregando...
          </div>
        ) : (
          <ul className="list-none p-0 m-0 h-full overflow-scroll scrollbar-hide">
            {chatHistory.map((chat) => (
              <li
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`mx-2 box-border p-2 cursor-pointer my-2 ${chat.id === selectedChatId
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-white dark:bg-gray-800'
                  } border-1 rounded-xl truncate ... border-gray-300 dark:border-gray-600 text-xs font-medium`}
              >
                {chat.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
