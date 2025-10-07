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
import { useRef, useState, useEffect } from "react";
import type { UIMessage, FileUIPart } from "ai";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { CodeIcon, Settings, TerminalIcon } from "lucide-react";

const Page = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const uploadFiles = useAction(api.mutations.uploadFiles);

  const hasMessages = messages.length > 0;

  // Autoscroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (status !== "ready") return;
    const toSend = message.text?.trim() ?? "";
    if (!toSend && !message.files?.length) return;

    // Handle file uploads if files are present
    let uploadedFiles: string[] = [];
    if (message.files && message.files.length > 0) {
      try {
        const fileUploads = message.files.map(async (file: FileUIPart) => {
          // FileUIPart has url (blob URL), filename, mediaType
          const response = await fetch(file.url);
          const buffer = await response.arrayBuffer();
          return {
            source: buffer,
            destination: `${file.filename}`,
          };
        });

        const formattedFiles = await Promise.all(fileUploads);
        await uploadFiles({ files: formattedFiles });
        uploadedFiles = formattedFiles.map((f) => f.destination);
      } catch (error) {
        console.error("Failed to upload files:", error);
        // Continue with the message even if file upload fails
      }
    }

    // Send message with uploaded file context
    const messageWithContext =
      uploadedFiles.length > 0
        ? `${toSend}\n\nUploaded files available for analysis:\n${uploadedFiles.map((file) => `- ${file}`).join("\n")}`
        : toSend;

    sendMessage({ text: messageWithContext });
    setText("");
  };

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
                return (
                  <Message key={m.id} from={m.role}>
                    <div>
                      <MessageContent>
                        {m.parts.map((part) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <Response key={part.type}>{part.text}</Response>
                              );
                            case "tool-run_code":
                              switch (part.state) {
                                case "input-available":
                                  return (
                                    <div
                                      key={`${part.type}-${part.toolCallId}`}
                                      className="flex items-center gap-2 w-fit text-xs text-muted-foreground"
                                    >
                                      <Settings className="h-4 w-4 animate-spin" />
                                      Running code analysis...
                                    </div>
                                  );
                                case "output-available":
                                  return (
                                    <div
                                      key={`${part.type}-${part.toolCallId}`}
                                      className="flex items-center gap-2 w-fit text-xs text-muted-foreground"
                                    >
                                      <Settings className="h-4 w-4" />
                                      Runned code analysis...
                                    </div>
                                  );
                              }

                            case "tool-run_command":
                              switch (part.state) {
                                case "input-available":
                                  return (
                                    <div
                                      key={`${part.type}-${part.toolCallId}`}
                                      className="flex items-center gap-2 w-fit text-xs text-muted-foreground"
                                    >
                                      <TerminalIcon className="h-4 w-4" />
                                      Executing command...
                                    </div>
                                  );
                                case "output-available":
                                  return (
                                    <div
                                      key={`${part.type}-${part.toolCallId}`}
                                      className="flex items-center gap-2 w-fit text-xs text-muted-foreground"
                                    >
                                      <TerminalIcon className="h-4 w-4" />
                                      Executed command...
                                    </div>
                                  );
                              }
                            default:
                              return null;
                          }
                        })}
                      </MessageContent>
                    </div>
                  </Message>
                );
              })}
              <div ref={messagesEndRef} />
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
                    onSubmit={handleSubmit}
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
              onSubmit={handleSubmit}
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
