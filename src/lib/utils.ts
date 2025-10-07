import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Daytona, type Sandbox } from "@daytonaio/sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
