import React from 'react';

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
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      marginBottom: '80px',
    }}>
      {isLoadingMessages ? (
        <div style={{ textAlign: 'center', padding: '1rem' }}>Loading messages...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {messages.map((m, index) => (
            <li
              key={index}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                backgroundColor: m.role === 'user' ? '#f0f9ff' : '#f8f9fa',
                borderRadius: '4px',
                maxWidth: '80%',
                marginLeft: m.role === 'user' ? 'auto' : '0'
              }}
            >
              <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
              {m.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageList;
