# llm-embeddings-util

Ask questions to custom data not included during an LLMs pre-training.

## Installation

```bash
$ npm install
```

Use the env.example to set up the .env file.

## Running the app

### To run the app in CLI mode:

Change the CLI_MODE variable in the .env file to:

```bash
CLI_MODE=1
```

Then to use a command, like e.g. an "exclaim" command which would add an exclamation mark to an input:

```bash
npm run cli exclaim Hello
```

This command will output:

```bash
Hello!
```

### To run the app in normal mode:

Change the CLI_MODE variable in the .env file to:

```bash
CLI_MODE=0
```

Then use this command to start the app:

```bash
npm start
```

## Test

```bash

```
