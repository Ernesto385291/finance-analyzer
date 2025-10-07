import { Daytona, type Sandbox } from "@daytonaio/sdk";

/**
 * Gets an existing sandbox or creates a new one for the given chat ID
 * @returns Promise<Sandbox> - The existing or newly created sandbox
 */
export async function getOrCreateSandbox(): Promise<Sandbox> {
  const daytona = new Daytona();

  let sandbox: Sandbox | null = null;

  try {
    sandbox = await daytona.findOne({
      labels: { id: "123" },
    });

    if (sandbox.state === "stopped" || sandbox.state === "archived") {
      await sandbox.start();
    }
  } catch (error) {
    // If no sandbox is found, findOne throws an error instead of returning null
    console.log(`No existing sandbox found for id 123, will create a new one`);
    sandbox = null;
  }

  if (!sandbox) {
    sandbox = await daytona.create({
      labels: { id: "123" },
      language: "python",
    });
  }

  return sandbox;
}
