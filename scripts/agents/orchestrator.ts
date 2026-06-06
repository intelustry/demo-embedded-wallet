/**
 * Multi-turn orchestrator: sends an initial prompt, then accepts follow-ups
 * from stdin so you can have a conversation with the agent.
 *
 * Usage: pnpm agent:orchestrate "initial prompt"
 */
import { Agent, CursorAgentError } from "@cursor/sdk";
import { createInterface } from "readline";
import { resolve } from "path";

async function main() {
  const initialPrompt = process.argv.slice(2).join(" ");
  if (!initialPrompt) {
    console.error("Usage: pnpm agent:orchestrate <initial prompt>");
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

  async function sendAndStream(prompt: string) {
    const run = await agent.send(prompt);
    for await (const event of run.stream()) {
      if (event.type === "assistant") {
        for (const block of event.message.content) {
          if (block.type === "text") process.stdout.write(block.text);
        }
      }
    }
    const result = await run.wait();
    console.log(`\n[status: ${result.status}]\n`);
    return result;
  }

  try {
    console.log(`Agent ${agent.agentId}\n`);
    await sendAndStream(initialPrompt);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const askNext = () =>
      rl.question("> ", async (line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "exit" || trimmed === "quit") {
          rl.close();
          return;
        }
        try {
          await sendAndStream(trimmed);
        } catch (err) {
          if (err instanceof CursorAgentError) {
            console.error(
              `Agent error: ${err.message} (retryable=${err.isRetryable})`
            );
          } else {
            console.error("Error:", err);
          }
          rl.close();
          return;
        }
        askNext();
      });
    askNext();

    await new Promise<void>((res) => rl.on("close", res));
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
