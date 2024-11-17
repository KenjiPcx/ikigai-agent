'use client';

import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from 'react';
import { RecommendationCards } from './recommendation-cards';

export function ChatPanel() {
  const [phase, setPhase] = useState<'ikigai' | 'recommendations'>('ikigai');
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm here to help you find your purpose through Ikigai. Let's start with the first question: What activities do you love doing? What makes you lose track of time?"
      }
    ],
  });

  useEffect(() => {
    // Check last message for completion
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.toolInvocations?.some(
      tool => tool.toolName === 'updateIkigai' && tool.args.completed
    )) {
      setTimeout(() => setPhase('recommendations'), 2000);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence mode="wait">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                {message.content}
                {message.toolInvocations?.map((tool) => (
                  <div key={tool.toolCallId} className="mt-4">
                    {tool.toolName === 'updateIkigai' && tool.state === 'result' && (
                      <div className="mt-4">
                        {tool.render()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
} 