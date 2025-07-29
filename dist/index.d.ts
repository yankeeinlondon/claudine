import { IsUnion, Suggest } from "inferred-types";

//#region src/types.d.ts

/**
 * The hook's which Claude Code exposes.
 */
type HookEventName = "PreToolUse" | "PostToolUse" | "UserPromptSubmit" | "Stop" | "SubagentStope" | "Notification" | "PreCompact" | "SessionStart";
type Tool = "Write" | "Edit" | "Read" | "Glob" | "Grep" | "MultiEdit" | "WebFetch" | "WebSearch" | "Task" | `Bash(ls:*)` | `Bash(tsc:*)` | `Bash(rm:*)` | `Bash(git stash:*)` | `Bash(pnpm:*)` | `Bash(sed:*)`;
type SuggestMatcher = Suggest<Tool | `Write|Edit` | `WebFetch|WebSearch`>;
type HookCommand = {
  /** optionally you may filter the Agent commands which will trigger this hook */
  matcher?: SuggestMatcher;
  command: Suggest<"$CLAUDE_PROJECT_DIR/.claude/hooks/check-style.sh">;
};
type Success = 0;
type Error = 1;
type BlockingError = 2;
/**
 * **HookHandlerConfig**
 *
 * The structure of what you'd put in your `.settings.json` or `.settings.local.json` file
 * to add handling for a specific event.
 *
 * **Note:** each "handler" is placed inside of the `hooks: { [event]: HookHandlerConfig[] }` part of the configuration file.
 */
type HookHandlerConfig = {
  /**
   * You may filter the handler to only execute when one of the
   * specified `AgentCommand`'s is the source. You may also use the `|`
   * operator inside your string configuration to indicate a _union_ of
   * AgentCommand's you will accept.
   */
  matcher?: SuggestMatcher;
  /** the things you want to execute when  */
  hooks: HookCommand[];
};
type Hook<T extends HookEventName = HookEventName> = {
  session_id: string;
  transcript_path: string;
  cwd: string;
  hook_event_name: HookEventName;
} & IsUnion<T> extends true ? {} : T extends "PreToolUse" ? {
  hook_event_name: "PreToolUse";
  tool_name: Suggest<Tool>;
  tool_input: {
    file_path: string;
    content: string;
  };
} : T extends "PostToolUse" ? {
  hook_event_name: "PostToolUse";
  tool_input: {
    file_path: string;
    content: string;
  };
  tool_response: {
    filePath: string;
    success: boolean;
  };
} : T extends "Notification" ? {
  hook_event_name: "Notification";
  message: string;
} : T extends "UserPromptSubmit" ? {
  hook_event_name: "UserPromptSubmit";
  prompt: string;
} : T extends "Stop" ? {
  hook_event_name: "Stop";
  stop_hook_active: boolean;
} : T extends "SubagentStop" ? {
  hook_event_name: "SubagentStop";
  stop_hook_active: boolean;
} : T extends "SessionStart" ? {
  hook_event_name: "SessionStart";
  source: Suggest<"startup">;
} : {};
type DecisionStrategy = "allow" | "deny" | "ask";
/**
 * The RAW response of a hook response is either a Unix exit code:
 *
 * - `0` - Success
 * - `1` - Error
 * - `2` - Blocking Error
 *
 * Or a JSON stringified string of `HookResponse` sent to STDOUT.
 */
type HookResponseRaw = string | Success | Error | BlockingError;
type HookResponse<T extends HookEventName> = ({
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
} & T extends "PreToolUse" ? {
  hookSpecificOutput?: {
    hookEventName: "PreToolUse";
    permissionDecision: DecisionStrategy;
    permissionDecisionReason: string;
  };
  /** @deprecated */
  decision?: DecisionStrategy;
  /** @deprecated */
  reason?: string;
} : T extends "PostToolUse" ? {
  decision?: "block" | undefined;
  reason: string;
} : T extends "UserPromptSubmit" ? {
  decision?: "block" | undefined;
  reason: string;
  hookSpecificOutput?: {
    hookEventName: "UserPromptSubmit";
    additionalContext: string;
  };
} : T extends "Stop" | "SubagentStop" ? {
  decision?: "block" | undefined;
  /**
   * Reason for stopping.
   *
   * **Note:* must be provided when Claude is blocked from stopping
   */
  reason?: string;
} : T extends "SessionStart" ? {
  hookSpecificOutput?: {
    hookEventName: "SessionStart";
    additionalContext: string;
  };
} : {}) | Success | Error | BlockingError;
/**
 * A callback function which handle Claude Code hook events.
 */
type HookHandler<T extends HookEventName> = <E extends Hook<T>>(event: E) => Promise<HookResponse<T>>;
//#endregion
//#region src/constants.d.ts
declare const SUCCESS: Success;
declare const ERROR: Error;
declare const BLOCKING_ERROR: BlockingError;
//#endregion
export { BLOCKING_ERROR, BlockingError, DecisionStrategy, ERROR, Error, Hook, HookCommand, HookEventName, HookHandler, HookHandlerConfig, HookResponse, HookResponseRaw, SUCCESS, Success, SuggestMatcher, Tool };