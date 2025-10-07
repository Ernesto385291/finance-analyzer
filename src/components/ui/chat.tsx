"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  PaperclipIcon,
  MicIcon,
  SendIcon,
  Settings2Icon,
  Share2Icon,
  PlusIcon,
} from "lucide-react"

type ChatMessageRole = "user" | "assistant"

export type ChatMessageData = {
  id: string
  role: ChatMessageRole
  name?: string
  avatarUrl?: string
  content: React.ReactNode
}

function ChatLayout({
  sidebar,
  header,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  sidebar?: React.ReactNode
  header?: React.ReactNode
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
  )
}

function ChatSidebar({
  onNewChat,
  conversations,
}: {
  onNewChat?: () => void
  conversations?: { id: string; title: string; dateLabel?: string }[]
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
  )
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
  )
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
  )
}

function ChatMessage({
  role,
  name,
  avatarUrl,
  children,
}: Omit<ChatMessageData, "id" | "content"> & { children: React.ReactNode }) {
  const isAssistant = role === "assistant"
  return (
    <div className={cn("flex items-start gap-3", isAssistant ? "" : "justify-end")}> 
      {isAssistant && (
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[80%]", isAssistant ? "" : "order-1")}>
        {name ? (
          <div className="text-muted-foreground mb-1 text-xs">{name}</div>
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
      {!isAssistant && (
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

function ChatTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: (React.ReactNode[])[]
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
  )
}

function ChatInputBar({
  onSend,
}: {
  onSend?: (value: string) => void
}) {
  const [value, setValue] = React.useState("")
  return (
    <div className="border-t pt-4">
      <div className="flex justify-center">
        <Card className="rounded-xl border p-3 max-w-2xl w-full">
          <div className="flex items-center gap-3">
            <Select>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="docs">Docs</SelectItem>
                <SelectItem value="files">Files</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Textarea
                rows={1}
                className="min-h-10 resize-none"
                placeholder="Ask me anything..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon-sm" title="Attach">
              <PaperclipIcon className="size-4" />
            </Button>
            <Button variant="outline" size="icon-sm" title="Voice">
              <MicIcon className="size-4" />
            </Button>
            <Button
              size="sm"
              disabled={!value.trim()}
              onClick={() => {
                if (!value.trim()) return
                onSend?.(value)
                setValue("")
              }}
            >
              <SendIcon className="size-4" />
              <span>Send</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export {
  ChatLayout,
  ChatSidebar,
  ChatHeaderActions,
  ChatThread,
  ChatMessage,
  ChatTable,
  ChatInputBar,
}


