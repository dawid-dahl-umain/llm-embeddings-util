import * as readlineSync from "readline-sync"
import * as colors from "colors"
import * as dotenv from "dotenv"
import {
    isQuitMessage,
    logGptResponseUnconfig,
    hasCalledFunction
} from "../../utils/utils"
import { Logger } from "@nestjs/common"
import { Command } from "commander"
import OpenAI from "openai"
import { CreateChatCompletionRequestMessage } from "openai/resources/chat"
import { ChatOptions } from "src/types"
import {
    gptAbstractFunctionsArray,
    gptAbstractFunctionsRecord
} from "../../gpt/functions/abstract"
import {
    getCountryPineconeCount,
    gptConcreteFunctionsRecord
} from "../../gpt/functions/concrete"

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
                const systemPrompt: CreateChatCompletionRequestMessage = {
                    role: "system",
                    content:
                        "You try to keep your answers fairly short, unless the context requires the message to be slightly longer."
                }
                const chatHistory: CreateChatCompletionRequestMessage[] = [
                    systemPrompt
                ]

                if (!openAiApiKey) {
                    throw new Error("Couldn't get the OpenAI API Key")
                }

                const openai = new OpenAI({
                    apiKey: openAiApiKey
                })

                try {
                    while (true) {
                        const userInput = readlineSync.question(
                            colors.yellow("You: ")
                        )

                        const messages: CreateChatCompletionRequestMessage[] =
                            chatHistory.map(message => ({
                                role: message.role,
                                name: message.name ? message.name : undefined,
                                content: message.content
                            }))

                        messages.push({ role: "user", content: userInput })

                        const completion = await openai.chat.completions.create(
                            {
                                messages: messages,
                                model: "gpt-3.5-turbo-0613",
                                temperature: 0.5,
                                functions: gptAbstractFunctionsArray,
                                function_call: "auto"
                            }
                        )

                        if (isQuitMessage(userInput)) {
                            logGptResponse(completion)
                            return
                        }

                        if (hasCalledFunction(completion)) {
                            logGptResponse(completion)

                            const functionName =
                                completion.choices[0].message.function_call.name
                            const functionArguments = JSON.parse(
                                completion.choices[0].message.function_call
                                    .arguments
                            )
                            const selectedFunction =
                                gptConcreteFunctionsRecord[functionName]

                            const functionResult = await selectedFunction(
                                functionArguments
                            )

                            messages.push({
                                role: "user",
                                content: userInput ? userInput : ""
                            })
                            messages.push({
                                role: "assistant",
                                content: completion?.choices[0].message?.content
                                    ? completion.choices[0].message.content
                                    : ""
                            })
                            messages.push({
                                role: "function",
                                name: functionName,
                                content: JSON.stringify(functionResult)
                            })
                        } else {
                            logGptResponse(completion)

                            messages.push({
                                role: "user",
                                content: userInput ? userInput : ""
                            })
                            messages.push({
                                role: "assistant",
                                content: completion?.choices[0].message?.content
                                    ? completion.choices[0].message.content
                                    : ""
                            })
                        }

                        chatHistory.push(...messages)
                    }
                } catch (e) {
                    logger.error(e)
                }
            })

export default chatCommand
