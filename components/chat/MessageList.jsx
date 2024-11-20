import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollShadow } from '@nextui-org/react';
import remarkGfm from 'remark-gfm';
import {
  CustomTable,
  CustomTableHead,
  CustomTableRow,
  CustomTableCell,
  CustomList,
  CustomHeading,
  CustomLink,
} from './CustomMarkdownComponents';

const MessageList = ({ messages, isLoadingMessages }) => {
  const filteredMessages = messages.filter(m => m.content.trim() !== '');

  return (
    <ScrollShadow className="flex-1 overflow-y-auto p-4 md:px-40">
      {isLoadingMessages ? (
        <div className="text-center p-4">Carregando mensagens...</div>
      ) : (
        <ul className="space-y-4 flex flex-col">
          {filteredMessages.map((m, index) => (
            <li
              key={index}
              className={`p-3 rounded-xl max-w-4/5 min-w-60 ${
                m.role === 'user'
                  ? 'bg-gray-200 self-end flex flex-col w-fit shadow-md'
                  : ' self-start'
              }`}
            >
              {m.role === 'user' ? (
                <p className="font-bold text-black">Você</p>
              ) : (
                <p className="font-bold w-fit bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                  Sophia:
                </p>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: CustomTable,
                  thead: CustomTableHead,
                  tr: CustomTableRow,
                  th: (props) => <CustomTableCell {...props} isHeader={true} />,
                  td: (props) => <CustomTableCell {...props} isHeader={false} />,
                  ul: (props) => <CustomList {...props} ordered={false} />,
                  ol: (props) => <CustomList {...props} ordered={true} />,
                  h1: (props) => <CustomHeading {...props} level={1} />,
                  h2: (props) => <CustomHeading {...props} level={2} />,
                  h3: (props) => <CustomHeading {...props} level={3} />,
                  h4: (props) => <CustomHeading {...props} level={4} />,
                  h5: (props) => <CustomHeading {...props} level={5} />,
                  h6: (props) => <CustomHeading {...props} level={6} />,
                  a: CustomLink,
                }}
                className="text-sm p-2"
              >
                {m.content}
              </ReactMarkdown>
            </li>
          ))}
        </ul>
      )}
    </ScrollShadow>
  );
};

export default MessageList;
