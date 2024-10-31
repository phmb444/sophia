import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoadingMessages: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoadingMessages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 mb-20">
      {isLoadingMessages ? (
        <div className="text-center p-4">Loading messages...</div>
      ) : (
        <ul className="list-none p-0 m-0">
          {messages.map((m, index) => (
            <li
              key={index}
              className={`p-3 mb-2 rounded-xl max-w-4/5 ${m.role === 'user' ? 'bg-blue-100 ml-[30vw]' : 'bg-gray-100 mr-[20vw]'}`}
            >
              {m.role === 'user' ? (
                <p className="font-bold text-black">
                  Você:{' '}
                </p>
              ) : (
                <p className="font-bold w-fit bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                  Sophia:{' '}
                </p>
              )}
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageList;
