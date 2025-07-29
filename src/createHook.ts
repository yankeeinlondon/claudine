import { isNumber, isObject } from "inferred-types";
import {  Hook, HookEventName, HookHandler } from "./types";
import readline from 'readline';



export function createHook<T extends HookEventName>(
    hook: T
) {
   return {
        handler<H extends HookHandler<T>>(handler: H) {
            const readStdIn = async function readStdin() {
                const rl = readline.createInterface({ input: process.stdin });
                const lines = [];
                for await (const line of rl) {
                    lines.push(line);
                }
                return lines.join('\n');
            }

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

                    if(isNumber(resp)) {
                        process.exit(resp);
                    } else {
                        console.log(JSON.stringify(resp));
                    }
                }
            }
        }
   } 
}
