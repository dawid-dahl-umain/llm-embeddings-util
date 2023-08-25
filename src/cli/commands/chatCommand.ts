import * as readlineSync from "readline-sync"
import * as colors from "colors"
import * as dotenv from "dotenv"
import {
    getCountryPineconeCount,
    logGptResponseUnconfig
} from "../../utils/utils"
import { Logger } from "@nestjs/common"
import { Command } from "commander"
import OpenAI from "openai"
import { ChatCompletionMessage } from "openai/resources/chat"
import { ChatOptions } from "src/types"
import gptFunctions from "src/utils/gptFunctions"

dotenv.config()

const chatCommand =
    (logger: Logger) =>
    (program: Command): Command =>
        program
            .command("chat")
            .description("Chat with GPT")
            .option("-k, --api-key <>", "OpenAI API key (.env alternative)")
            .option(
                "-d, --response-debug",
                "Whether to post the chat response data and not just the message"
            )
            .action(async (options: ChatOptions) => {
                const logGptResponse = options.responseDebug
                    ? logGptResponseUnconfig(logger, true)
                    : logGptResponseUnconfig(logger)
                const openAiApiKey =
                    process.env.OPENAI_API_KEY || options.apiKey
                const chatHistory: ChatCompletionMessage[] = [
                    {
                        role: "system",
                        content:
                            "You try to keep your answers fairly short, unless the context requires the message to be slightly longer."
                    }
                ]

                if (!openAiApiKey) {
                    throw new Error("Couldn't get the OpenAI API Key")
                }

                const openai = new OpenAI({
                    apiKey: openAiApiKey
                })

                while (true) {
                    const userInput = readlineSync.question(
                        colors.yellow("You: ")
                    )

                    const messages = chatHistory.map(message => ({
                        role: message.role,
                        content: message.content
                    }))

                    messages.push({ role: "user", content: userInput })

                    try {
                        const completion = await openai.chat.completions.create(
                            {
                                messages: messages,
                                model: "gpt-3.5-turbo-0613",
                                functions: gptFunctions,
                                function_call: "auto"
                            }
                        )

                        if (
                            userInput.toLowerCase() === "exit" ||
                            userInput.toLowerCase() === "quit"
                        ) {
                            logGptResponse(completion.choices[0])
                            return
                        }

                        logGptResponse(completion.choices[0])
                    } catch (e) {
                        logger.error(e)
                    }
                }
            })

export default chatCommand
