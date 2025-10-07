"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { motion, AnimatePresence } from "motion/react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { useRef, useState } from "react";
import type { UIMessage } from "ai";

const Page = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  type TextUIPart = { type: "text"; text: string };
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
            <div className="flex flex-col gap-6 overflow-y-auto px-2 max-h-[80vh]">
              {messages.map((m: UIMessage) => {
                const content = m.parts
                  .filter((p): p is TextUIPart => p.type === "text")
                  .map((p) => p.text)
                  .join("");
                return (
                  <Message key={m.id} from={m.role}>
                    <div>
                      <MessageContent>
                        <Response>{content}</Response>
                      </MessageContent>
                    </div>
                  </Message>
                );
              })}
            </div>
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
                <div className="w-full">
                  <PromptInput
                    className="w-full"
                    globalDrop
                    multiple
                    onSubmit={(message) => {
                      if (status !== "ready") return;
                      const toSend = message.text?.trim() ?? "";
                      if (!toSend && !message.files?.length) return;
                      sendMessage({ text: toSend, files: message.files });
                      setText("");
                    }}
                  >
                    <PromptInputBody>
                      <PromptInputAttachments>
                        {(attachment) => (
                          <PromptInputAttachment data={attachment} />
                        )}
                      </PromptInputAttachments>
                      <PromptInputTextarea
                        onChange={(e) => setText(e.target.value)}
                        ref={textareaRef}
                        value={text}
                      />
                    </PromptInputBody>
                    <PromptInputToolbar>
                      <PromptInputTools>
                        <PromptInputActionMenu>
                          <PromptInputActionMenuTrigger />
                          <PromptInputActionMenuContent>
                            <PromptInputActionAddAttachments />
                          </PromptInputActionMenuContent>
                        </PromptInputActionMenu>
                      </PromptInputTools>
                      <PromptInputSubmit status={status} />
                    </PromptInputToolbar>
                  </PromptInput>
                </div>
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
          <div className="w-full">
            <PromptInput
              className="w-full"
              globalDrop
              multiple
              onSubmit={(message) => {
                if (status !== "ready") return;
                const toSend = message.text?.trim() ?? "";
                if (!toSend && !message.files?.length) return;
                sendMessage({ text: toSend, files: message.files });
                setText("");
              }}
            >
              <PromptInputBody>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
                <PromptInputTextarea
                  onChange={(e) => setText(e.target.value)}
                  ref={textareaRef}
                  value={text}
                />
              </PromptInputBody>
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit status={status} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Page;
