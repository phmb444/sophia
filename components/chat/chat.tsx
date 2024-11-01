/* eslint-disable @next/next/no-img-element */
'use client'

import { Message, useChat } from 'ai/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './ChatHistory';
import MessageList from './MessageList';
import { Input, Button, Switch, Select, SelectItem, Textarea } from '@nextui-org/react';
import { MessageSquare, Upload, Plus, Send } from 'lucide-react';

export default function Chat() {
  const [token, setToken] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ id: string, date: string, title: string }[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string | null>(null);
  const [isWebSearch, setIsWebSearch] = useState(true);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            setChatTitle(data[0].title);
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
    setChatTitle('Inicie uma nova conversa');
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
    scrollToBottom(); // Scroll when a new chat is initialized
  }, [handleNewChat]);

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
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingMessages(false);
    }
    if (window.innerWidth < 768) {
      console.log(window.innerWidth);
      setIsCollapsed(true);
    }
  };
  return (
    <div className="flex h-[88vh] mt-[-3vh] rounded-3xl p-[1.5px] bg-gradient-to-r from-yellow-400/30 via-pink-500/30 to-purple-500/30">
      <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 rounded-3xl">
        {/* Chat History Sidebar */}
        {isCollapsed ? (
          <p></p>
        ) : (
          <ChatHistory
            chatHistory={chatHistory}
            selectedChatId={selectedChatId || ''}
            onChatSelect={handleChatSelect}
            isSubmitting={isSubmitting}
            onNewChat={handleNewChat}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}

        {/* Main Chat Area */}
        <div className={"flex-1 flex flex-col" + (!isCollapsed ? " hidden md:flex" : "")}>
          <div className='flex px-2 md:px-4 items-center'>
            {isCollapsed ? (<div className="p-2">
              <Button isIconOnly variant="light" onClick={() => setIsCollapsed(false)}>
                <img src="/arrows-out-line-horizontal.svg" alt="" />
              </Button>
            </div>) : null}
            {/* Chat Title */}
            <h1 className="font-bold md:ml-12 text-gray-500  md:text-3xl text-center my-4">
              {chatTitle || 'Nova Conversa'}
            </h1>
          </div>
          {/* Chat Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto"
          >
            <MessageList key={selectedChatId} messages={messages} isLoadingMessages={isLoadingMessages} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between space-x-2 mb-2">
              <div className='flex items-center'><Switch
                checked={isWebSearch}
                onChange={() => setIsWebSearch(!isWebSearch)}
                color="primary"
                aria-label="Toggle between Web Search and Knowledge Base"
              />
                <label htmlFor="search-mode" className="text-sm w-fit font-medium">
                  {isWebSearch ? 'Web Search' : 'Knowledge Base'}
                </label>
                {!isWebSearch && (
                  <Select
                    placeholder="Select KB"
                    value={selectedKnowledgeBase}
                    onChange={(event) => setSelectedKnowledgeBase(event.target.value)}
                    aria-label="Knowledge Base Selector"
                    className='max-w-60'
                  >
                    <SelectItem key="math" value="math">
                      Math KB
                    </SelectItem>
                    <SelectItem key="science" value="science">
                      Science KB
                    </SelectItem>
                    <SelectItem key="history" value="history">
                      History KB
                    </SelectItem>
                    <SelectItem key="new" value="new">
                      <span className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New KB
                      </span>
                    </SelectItem>
                  </Select>
                )}</div>

              <Button isIconOnly variant="light">
                <Upload />
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex space-x-2 items-center"
            >
              <Textarea
                value={input}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="Type your message here..."
                className="flex-1"
                minRows={1}
                size='lg'
                classNames={{
                  label: "text-black/50 dark:text-white/90",
                  input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text",
                  ],
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                endContent={<Send />}
                radius="full"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              >
                {isSubmitting ? '...' : 'Send'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


