'use client'

import { Message, useChat } from 'ai/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './ChatHistory';
import MessageList from './MessageList';
import { Input, Button } from '@nextui-org/react';

export default function Chat() {
  const [token, setToken] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ id: string, date: string, title: string }[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading: isSubmitting, reload, setMessages } = useChat({
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
          .then(res => res.json().then(data => {
            setChatHistory(data);
          }))
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
    setMessages([]);
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
    scrollToBottom(); // Scroll to bottom whenever messages change
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

      const data: { messages: Message[], title: string } = await res.json();
      setMessages(data.messages);
      setChatTitle(data.title); // Set the chat title
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
      <ChatHistory 
        chatHistory={chatHistory} 
        selectedChatId={selectedChatId || ""} 
        onChatSelect={handleChatSelect} 
        isSubmitting={isSubmitting} 
        onNewChat={handleNewChat} 
      />
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
        {chatTitle && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#f0f0f0',
            color: '#333',
            borderRadius: '4px',
            margin: '1rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {chatTitle}
          </div>
        )}
        <div 
          ref={messagesContainerRef} 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '1rem' 
          }}
        >
          <MessageList messages={messages} isLoadingMessages={isLoadingMessages} />
        </div>
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
            <Input
              value={input}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Type your message..."
              style={{ flex: 1 }}
            />
            <Button
              type="submit"
              isLoading={isSubmitting}
              color='primary'
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
