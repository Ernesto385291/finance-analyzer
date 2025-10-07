'use client';

import { useState } from 'react';
import {
  ChatHeaderActions,
  ChatThread,
  ChatMessage,
  ChatTable,
  ChatInputBar,
  type ChatMessageData,
} from '@/components/ui/chat';

const Page = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: 'm1',
      role: 'user',
      name: 'You',
      avatarUrl: 'https://github.com/haydenbleasel.png',
      content: 'What are the best open opportunities by company size?',
    },
    {
      id: 'm2',
      role: 'assistant',
      name: 'Orbita GPT',
      avatarUrl: 'https://github.com/openai.png',
      content: (
        <div className="space-y-3">
          <div className="text-muted-foreground text-sm">
            Here's a detailed breakdown of the best opportunities by company size:
          </div>
          <ChatTable
            columns={["Company Size", "Best Opportunities"]}
            rows={[
              [
                'Startup (1-50 Employees)',
                (
                  <ul className="list-disc pl-5">
                    <li>Flexible roles across functions</li>
                    <li>Equity or stock ownership</li>
                    <li>Rapid career growth opportunities</li>
                  </ul>
                ),
              ],
              [
                'Small Business (51-200 Employees)',
                (
                  <ul className="list-disc pl-5">
                    <li>Greater responsibility than large companies</li>
                    <li>Ability to shape business strategies</li>
                    <li>Faster advancement potential</li>
                  </ul>
                ),
              ],
              ['Mid-Sized Co', <span />],
            ]}
          />
        </div>
      ),
    },
  ]);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: 'user',
        name: 'You',
        avatarUrl: 'https://github.com/haydenbleasel.png',
        content: text,
      },
    ]);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4 px-4 pb-4 pt-2 md:px-6">
      <div className="flex items-center justify-end">
        <ChatHeaderActions />
      </div>
      <div className="flex-1 min-h-0">
        <ChatThread>
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              role={m.role}
              name={m.name}
              avatarUrl={m.avatarUrl}
            >
              {m.content}
            </ChatMessage>
          ))}
        </ChatThread>
      </div>
      <ChatInputBar onSend={handleSend} />
    </div>
  );
};

export default Page;
