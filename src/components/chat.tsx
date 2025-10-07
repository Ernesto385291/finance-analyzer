"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Settings2Icon, Share2Icon, PlusIcon, GlobeIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

type ChatMessageRole = "user" | "assistant";

export type ChatMessageData = {
  id: string;
  role: ChatMessageRole;
  name?: string;
  avatarUrl?: string;
  content: React.ReactNode;
};

const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

function ChatLayout({
  sidebar,
  header,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <div
      data-slot="chat-layout"
      className={cn(
        "bg-background text-foreground grid h-dvh grid-cols-[280px_1fr] grid-rows-[auto_1fr_auto] gap-x-6 px-6 py-4 md:grid-cols-[300px_1fr]",
        className
      )}
      {...props}
    >
      <aside className="col-span-1 row-span-3 hidden flex-col gap-4 md:flex">
        {sidebar}
      </aside>
      <header className="col-start-2 row-start-1 flex items-center justify-end gap-2">
        {header}
      </header>
      <main className="col-start-2 row-start-2 overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}

function ChatSidebar({
  onNewChat,
  conversations,
}: {
  onNewChat?: () => void;
  conversations?: { id: string; title: string; dateLabel?: string }[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Chat</div>
        <Button size="sm" variant="secondary" onClick={onNewChat}>
          <PlusIcon className="size-4" />
          <span>New Chat</span>
        </Button>
      </div>
      <div className="mt-4 flex-1 overflow-auto pr-2">
        {conversations?.length ? (
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li
                key={c.id}
                className="text-muted-foreground hover:text-foreground rounded-md px-2 py-2 text-sm hover:bg-accent cursor-pointer"
                title={c.title}
              >
                <div className="line-clamp-1">{c.title}</div>
                {c.dateLabel ? (
                  <div className="text-xs opacity-60">{c.dateLabel}</div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground text-sm">No conversations</div>
        )}
      </div>
    </div>
  );
}

function ChatHeaderActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="outline" size="sm">
        <Settings2Icon className="size-4" />
        <span>Configuration</span>
      </Button>
      <Button variant="outline" size="sm">
        <Share2Icon className="size-4" />
        <span>Share</span>
      </Button>
      <Button variant="default" size="sm">
        <PlusIcon className="size-4" />
        <span>New Chat</span>
      </Button>
    </div>
  );
}

function ChatThread({ children, className }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-thread"
      className={cn(
        "flex h-full flex-col gap-6 overflow-y-auto px-2",
        className
      )}
    >
      {children}
    </div>
  );
}

function ChatMessage({
  role,
  name,
  children,
}: Omit<ChatMessageData, "id" | "content"> & { children: React.ReactNode }) {
  const isAssistant = role === "assistant";
  return (
    <div
      className={cn("flex items-start gap-3", isAssistant ? "" : "justify-end")}
    >
      <div className={cn("max-w-[80%]", isAssistant ? "" : "order-1")}>
        {name ? (
          <div className="text-muted-foreground mb-2 text-xs">{name}</div>
        ) : null}
        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm shadow-sm",
            isAssistant
              ? "bg-card text-card-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ChatTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-2 bg-secondary/60 text-xs font-medium">
        {columns.map((h, i) => (
          <div key={i} className="border-b px-4 py-2">
            {h}
          </div>
        ))}
      </div>
      <div className="divide-y">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2">
            {r.map((cell, j) => (
              <div key={j} className="px-4 py-3 text-sm">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatInputBar({
  onSend,
  className,
}: {
  onSend?: (value: string) => void;
  className?: string;
}) {
  const [text, setText] = React.useState<string>("");
  const [model, setModel] = React.useState<string>(models[0].id);
  const [status, setStatus] = React.useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const stop = () => {
    console.log("Stopping request...");

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setStatus("ready");
  };

  const handleSubmit = (message: PromptInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === "streaming" || status === "submitted") {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    timeoutRef.current = setTimeout(() => {
      setStatus("ready");
      timeoutRef.current = null;
    }, STREAMING_TIMEOUT);

    // Call the original onSend callback
    if (message.text) {
      onSend?.(message.text);
    }
  };

  return (
    <div className={cn(className)}>
      <PromptInput globalDrop multiple onSubmit={handleSubmit}>
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
            <PromptInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputModelSelect onValueChange={setModel} value={model}>
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((modelOption) => (
                  <PromptInputModelSelectItem
                    key={modelOption.id}
                    value={modelOption.id}
                  >
                    {modelOption.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export {
  ChatLayout,
  ChatSidebar,
  ChatHeaderActions,
  ChatThread,
  ChatMessage,
  ChatTable,
  ChatInputBar,
};
