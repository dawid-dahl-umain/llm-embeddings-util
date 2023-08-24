# llm-embeddings-util

Ask questions to custom data not included during an LLMs pre-training.

## Installation

```bash
$ npm install
```

Use the env.example to set up the .env file.

## Running the app

Use Node version 16.

### To run the app in CLI mode:

Change the CLI_MODE variable in the .env file to:

```bash
CLI_MODE=1
```

Then to use a command, like e.g. an "exclaim" command which would add an exclamation mark to an input:

```bash
npm run cli -- exclaim Hello
```

This command will output:

```bash
Hello!
```

If options are available to the commands, you add them like this:

```bash
npm run cli -- chat "This is my query..." -k some-api-key
```

The reason we need the double dash (--) detailed here:

[Learn more about handling command-line options with npm run-script](https://github.com/tj/commander.js?#npm-run-script)

### To run the app in normal mode:

TODO...

Change the CLI_MODE variable in the .env file to:

```bash
CLI_MODE=0
```

Then use this command to start the app:

```bash
npm start
```
