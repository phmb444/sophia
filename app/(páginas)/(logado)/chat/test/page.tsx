/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, Input, Select, SelectItem, Switch, Accordion, AccordionItem, Textarea } from "@nextui-org/react"
import { MessageSquare, Upload, Plus, Send, ChevronLeft, ChevronRight } from "lucide-react"

export default function Component() {
    const [isWebSearch, setIsWebSearch] = useState(true)
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('')
    const [isCollapsed, setIsCollapsed] = useState(false)
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }

    useEffect(() => {
      scrollToBottom()
    }, [])

    return (
        <div className="flex h-[85vh] rounded-3xl p-[1.5px] bg-gradient-to-r from-yellow-400/30 via-pink-500/30 to-purple-500/30">
            <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                {/* Chat History Sidebar */}
                {isCollapsed ? (
                    <div className="p-2">
                        <Button isIconOnly variant="light" onClick={() => setIsCollapsed(false)}>
                            <ChevronRight />
                        </Button>
                    </div>
                ) : (
                    <div className="w-64 bg-white rounded-3xl dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold">Chat History</h2>
                            <Button isIconOnly variant="light" onClick={() => setIsCollapsed(true)}>
                                <ChevronLeft />
                            </Button>
                        </div>
                        <div className="pt-4 px-2 space-y-2 overflow-y-auto h-[calc(100vh-60px)]">
                            {["Math Tutor", "Science Helper", "History Facts", "Language Learning"].map((chat, index) => (
                                <Button key={index} variant="light" className="w-full justify-start truncate max-w-full">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {chat}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <h1 className='px-4 font-bold text-gray-500 text-3xl text-center mt-8'>New Chat</h1>
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 p-4 overflow-y-auto"
                    >
                        {/* Chat messages would go here */}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 mb-2">
                            <Switch
                                checked={isWebSearch}
                                onChange={() => setIsWebSearch(!isWebSearch)}
                                color="primary"
                                aria-label="Toggle between Web Search and Knowledge Base"
                            />
                            <label htmlFor="search-mode" className="text-sm font-medium">
                                {isWebSearch ? "Web Search" : "Knowledge Base"}
                            </label>
                            {!isWebSearch && (
                                <Select
                                    placeholder="Select KB"
                                    value={selectedKnowledgeBase}
                                    onChange={(event) => setSelectedKnowledgeBase(event.target.value)}
                                    aria-label="Knowledge Base Selector"
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
                            )}
                        </div>
                        <div className="flex space-x-2 items-center shadow-lg">
                            <Textarea
                                placeholder="Type your message here..."
                                className="shadow-xl"
                                fullWidth
                                variant="flat"
                                size="sm"
                                isMultiline
                            />
                            <Button isIconOnly variant="light">
                                <Upload />
                            </Button>
                            <Button
                                endContent={<Send />}
                                radius="full"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
