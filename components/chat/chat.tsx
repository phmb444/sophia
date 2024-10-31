'use client'

import { Message, useChat } from 'ai/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Add this import

export default function Chat() {
  const [token, setToken] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ id: string; firstMessage: { content: string, role: string } }[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const {data, messages, input, handleInputChange, handleSubmit, isLoading: isSubmitting, reload, setMessages } = useChat({
    api: '/api/chat',
    body: { chat_id: selectedChatId },
    headers: { Token: token as string },
    initialMessages: [],
    id: selectedChatId || undefined,
    onFinish: () => {
      if (token) {
        fetch('/api/chat', {
          headers: { Token: token },
        })
          .then(res => {
            console.log(res.statusText);
            const headers = res.headers;
            headers.forEach((value, key) => {
              console.log(`${key}: ${value}`);
            });
            return res.json().then(data => {
              setChatHistory(data);
            });
          })
          .catch(err => setError(err.message));
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  
  const handleNewChat = useCallback(() => {
    const newChatId = uuidv4();
    setSelectedChatId(newChatId);
    setMessages([]); // Clear existing messages
    // Optionally, you can fetch or initialize the new chat as needed
  }, [setMessages]);

  useEffect(() => {
    const storedToken = localStorage.getItem("sophia_token");
    if (!storedToken) {
      window.location.href = "/";
      return;
    }

    setToken(storedToken);
    setIsLoadingHistory(true);

    fetch('/api/chat', {
      headers: { Token: storedToken },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load chat history');
        return res.json();
      })
      .then(data => {
        setChatHistory(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
      handleNewChat();
  },[handleNewChat]);

  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSelect = async (id: string) => {
    if (id === selectedChatId || !token) return;

    setIsLoadingMessages(true);
    setSelectedChatId(id);

    try {
      const res = await fetch(`/api/chat?chat_id=${id}`, {
        headers: { Token: token },
      });

      if (!res.ok) throw new Error('Failed to load messages');

      const data: Message[] = await res.json();
      setMessages(data);
      reload();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  

  return (
    <div style={{
      display: 'flex',
      height: '90vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar com histórico */}
      <div style={{
        width: '30%',
        border: '1px solid #ccc',
        padding: '1rem',
        overflowY: 'auto',
        backgroundColor: '#f5f5f5',
        height: '90vh'
      }}>
        <button onClick={handleNewChat} style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          New Chat
        </button>
        {isLoadingHistory ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>Loading chats...</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {chatHistory.map(chat => (
              <li
                key={chat.id}
                onClick={() => !isSubmitting && handleChatSelect(chat.id)}
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
        )}
      </div>

      {/* Chat principal */}
      <div style={{
        width: '70%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '4px',
            margin: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Área de mensagens */}
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
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        {/* Formulário fixo na parte inferior */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #eee',
          padding: '1rem'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '1rem',
          }}>
            <input
              value={input}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


