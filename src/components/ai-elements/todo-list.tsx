"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  ListTodoIcon,
  XCircleIcon,
} from "lucide-react";

export type TodoItem = {
  id: string;
  content: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
};

export type TodoListProps = ComponentProps<typeof Collapsible> & {
  todos: TodoItem[];
  title?: string;
};

const getStatusBadge = (status: TodoItem["status"]) => {
  const labels = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  } as const;

  const icons = {
    pending: <CircleIcon className="size-4" />,
    in_progress: <ClockIcon className="size-4 animate-pulse text-blue-600" />,
    completed: <CheckCircleIcon className="size-4 text-green-600" />,
    cancelled: <XCircleIcon className="size-4 text-red-600" />,
  } as const;

  const variants = {
    pending: "secondary" as const,
    in_progress: "default" as const,
    completed: "secondary" as const,
    cancelled: "destructive" as const,
  };

  return (
    <Badge className="gap-1.5 rounded-full text-xs" variant={variants[status]}>
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const TodoList = ({
  todos,
  title = "Todo List",
  className,
  ...props
}: TodoListProps) => (
  <Collapsible
    className={cn("not-prose mb-4 w-full rounded-md border", className)}
    defaultOpen={true}
    {...props}
  >
    <CollapsibleTrigger asChild>
      <div className="flex w-full items-center justify-between gap-4 p-3 cursor-pointer hover:bg-muted/50">
        <div className="flex items-center gap-2">
          <ListTodoIcon className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title}</span>
          <Badge variant="outline" className="text-xs">
            {todos.length} tasks
          </Badge>
        </div>
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent className="data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in">
      <div className="space-y-2 p-4 border-t">
        {todos.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center py-4">
            No tasks yet
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusBadge(todo.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    todo.status === "completed" &&
                      "line-through text-muted-foreground",
                    todo.status === "cancelled" &&
                      "line-through text-muted-foreground"
                  )}
                >
                  {todo.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </CollapsibleContent>
  </Collapsible>
);
