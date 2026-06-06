import { Agent, CursorAgentError } from "@cursor/sdk";
import { resolve } from "path";

async function main() {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) {
    console.error("Usage: pnpm agent:run <prompt>");
    console.error('  Example: pnpm agent:run "Refactor the auth provider"');
    process.exit(1);
  }

  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error(
      "CURSOR_API_KEY is not set. Get one at https://cursor.com/dashboard/cloud-agents"
    );
    process.exit(1);
  }

  const projectRoot = resolve(__dirname, "../..");

  const agent = await Agent.create({
    apiKey,
    model: { id: "composer-2" },
    local: { cwd: projectRoot },
  });

  try {
    const run = await agent.send(prompt);
    console.log(`Agent ${agent.agentId} | Run ${run.id}\n`);

    for await (const event of run.stream()) {
      if (event.type === "assistant") {
        for (const block of event.message.content) {
          if (block.type === "text") process.stdout.write(block.text);
        }
      }
    }

    const result = await run.wait();
    console.log(`\n\nRun finished with status: ${result.status}`);

    if (result.status === "error") {
      process.exit(2);
    }
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(
        `Startup failed: ${err.message} (retryable=${err.isRetryable})`
      );
      process.exit(1);
    }
    throw err;
  } finally {
    await agent[Symbol.asyncDispose]();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
