# Claudine

Simple tooling to aid in working with Claude Code CLI.

## Usage 

Let's imagine that you want to handle the `PreToolUse` event:

```ts
import { createHook } from "@yankeeinlondon/claudine";

await createHook("PreToolUse")
    .handler(async (event) => {
        // add your handler code, `event` is already strong typed
    })
    // pick up the text from STDIN, parse it into a strongly typed 
    // and handle any unexpected errors in a graceful manner
    .handle(); 
```

By using this _builder pattern_ you are getting:

- strong type control over the _inputs_ and _outputs_ of each event type
- a wrapper around any unexpected errors in your handler code which will help to

### Types

You can, if you prefer, just use the types which this library provides.


## Installation

### NPM Registry

| <span style="font-weight: 200">Manager</span>| <span style="font-weight: 200">Shell Command</span> |
| --- | --- |
| **npm** | npm install @yankeeinlondon/gotcha  |
| **pnpm** | pnpm add @yankeeinlondon/gotcha | 
| **yarn** | yarn add @yankeeinlondon/gotcha | 
| **bun** | bun add @yankeeinlondon/gotcha | 


<details>
<summary>
Click here for **Deno** and **JSR** installation details
</summary>

### Deno/JSR

```ts
import { gotcha, isOk } from "jsr:@yankeeinlondon/gotcha";
```

Or add to your `deno.json`:

```json
{
  "imports": {
    "gotcha": "jsr:@yankeeinlondon/gotcha"
  }
}
```

### GitHub Packages

```bash
npm install @yankeeinlondon/gotcha --registry=https://npm.pkg.github.com
```

Or configure `.npmrc`:

```conf
@yankeeinlondon:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

</details>
