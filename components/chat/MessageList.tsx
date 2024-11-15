import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollShadow } from '@nextui-org/react';

interface Message {
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoadingMessages: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoadingMessages }) => {
  const filteredMessages = messages.filter(m => m.content.trim() !== '');

  return (
    <ScrollShadow className="flex-1 overflow-y-auto p-4">
      {isLoadingMessages ? (
        <div className="text-center p-4">Loading messages...</div>
      ) : (
        <ul className="space-y-4 flex flex-col">
          {filteredMessages.map((m, index) => (
            <li
              key={index}
              className={`p-3 rounded-xl max-w-4/5 min-w-60 shadow-md ${
                m.role === 'user'
                  ? ' bg-gray-200 self-end flex flex-col w-fit'
                  : ' bg-zinc-100 self-start'
              }`}
            >
              {m.role === 'user' ? (
                <p className="font-bold text-black">Você</p>
              ) : (
                <p className="font-bold w-fit bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                  Sophia:
                </p>
              )}
              <ReactMarkdown className="text-sm p-2">{m.content}</ReactMarkdown>
            </li>
          ))}
        </ul>
      )}
    </ScrollShadow>
  );
};

export default MessageList;
