import type { Hook, HookEventName, HookHandler } from "./types";
import readline from "node:readline";
import { isNumber } from "inferred-types";
import { Unexpected } from "./errors";

/**
 * **createHook**(hook)
 *
 * A builder pattern for handing Claude Code hooks.
 *
 * - [Docs](https://docs.anthropic.com/en/docs/claude-code/hooks) for Claude Hooks
 */
export function createHook<T extends HookEventName>(
    _hook: T
) {
    return {
        handler<H extends HookHandler<T>>(handler: H) {
            try {
                const readStdIn = async function readStdin() {
                    const rl = readline.createInterface({ input: process.stdin });
                    const lines = [];
                    for await (const line of rl) {
                        lines.push(line);
                    }
                    return lines.join("\n");
                };

                return {
                    /**
                     * **handle()**
                     *
                     * your handler is configured so in the hook handler file just run this
                     * `handle()` function and it will read in STDIN, parse the input, and
                     * run your handler code.
                     */
                    async handle() {
                        const text = await readStdIn();
                        const event = JSON.parse(text) as Hook<T>;
                        const resp = await handler(event);

                        if (isNumber(resp)) {
                            process.exit(resp);
                        }
                        else {
                            console.log(JSON.stringify(resp));
                        }
                    }
                };
            }
            catch (e) {
                throw Unexpected.proxy(e);
            }
        }
    };
}
