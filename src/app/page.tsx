"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChatThread,
  ChatMessage,
  ChatInputBar,
  type ChatMessageData,
} from "@/components/chat";

const Page = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: "user",
        name: "You",
        content: text,
      },
    ]);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-1 overscroll-behavior-contain h-full min-w-0 touch-pan-y flex-col gap-4 px-4 pb-4 pt-2 md:px-6 mx-auto max-w-4xl">
      <AnimatePresence mode="wait">
        {hasMessages ? (
          <motion.div
            key="with-messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-h-0"
          >
            <ChatThread>
              {messages.map((m) => (
                <ChatMessage key={m.id} role={m.role} name={m.name}>
                  {m.content}
                </ChatMessage>
              ))}
            </ChatThread>
          </motion.div>
        ) : (
          <motion.div
            key="no-messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="w-full flex flex-col space-y-6">
              <div className="text-2xl text-center text-zinc-500">
                Ask about your finances
              </div>
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-full"
              >
                <ChatInputBar onSend={handleSend} className="w-full" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasMessages && (
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <ChatInputBar onSend={handleSend} className="w-full" />
        </motion.div>
      )}
    </div>
  );
};

export default Page;
