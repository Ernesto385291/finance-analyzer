"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { getOrCreateSandbox } from "../lib/daytona";

export const uploadFiles = action({
  args: {
    files: v.array(
      v.object({
        source: v.bytes(),
        destination: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const sandbox = await getOrCreateSandbox();

    const files = args.files.map((file) => ({
      source: Buffer.from(file.source),
      destination: file.destination,
    }));

    await sandbox.fs.uploadFiles(files);

    return {
      success: true,
      message: `Successfully uploaded ${files.length} files`,
    };
  },
});
