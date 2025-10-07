import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chat: defineTable({
    title: v.string(),
    userId: v.id("user"),
    visibility: v.union(v.literal("public"), v.literal("private")),
    lastContext: v.optional(v.any()),
  }).index("by_userId", ["userId"]),

  message: defineTable({
    chatId: v.id("chat"),
    role: v.string(),
    parts: v.any(),
    attachments: v.any(),
  }).index("by_chatId", ["chatId"]),
});