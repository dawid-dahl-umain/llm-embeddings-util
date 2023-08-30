import { Logger } from "@nestjs/common"
import * as colors from "colors"
import { Command } from "commander"
import * as dotenv from "dotenv"
import OpenAI from "openai"
import { CreateChatCompletionRequestMessage } from "openai/resources/chat"
import * as readlineSync from "readline-sync"
import { systemPrompt } from "../../gpt/prompts/systemPrompt"
import { ChatOptions } from "src/types"
import { gptAbstractCodeSmellFunctionsArray } from "../../gpt/functions/code-smells/abstract"
import { gptConcreteCodeSmellFunctionsRecord } from "../../gpt/functions/code-smells/concrete"
import {
    hasCalledFunction,
    isQuitMessage,
    logGptResponseUnconfig,
    removeElementsFromOffset
} from "../../utils/utils"

dotenv.config()

const findCodeSmellsCommand =
    (logger: Logger) =>
    (program: Command): Command =>
        program
            .command("find-code-smells")
            .description("Find code smells with Chat GPT")
            .option("-k, --api-key <>", "OpenAI API key (.env alternative)")
            .option(
                "-d, --response-debug",
                "Whether to post the chat response data and not just the message"
            )
            .action(async (options: ChatOptions) => {
                const logGptResponse = options.responseDebug
                    ? logGptResponseUnconfig(logger, true)
                    : logGptResponseUnconfig(logger)
                const openAiModel = process.env.OPENAI_MODEL
                    ? process.env.OPENAI_MODEL
                    : "gpt-3.5-turbo-0613"
                const openAiApiKey =
                    process.env.OPENAI_API_KEY || options.apiKey
                const chatHistoryMessageLimit = process.env
                    .CHAT_HISTORY_MESSAGE_LIMIT
                    ? Number(process.env.CHAT_HISTORY_MESSAGE_LIMIT)
                    : 100

                logger.log(
                    colors.bold(
                        colors.italic(
                            `Initializing agent with model "${openAiModel}".`
                        )
                    )
                )

                if (!openAiApiKey) {
                    throw new Error("Couldn't get the OpenAI API Key")
                }

                const openai = new OpenAI({
                    apiKey: openAiApiKey
                })

                const chatLoop = async (
                    chatHistory: CreateChatCompletionRequestMessage[]
                ): Promise<void> => {
                    try {
                        const userInput = readlineSync.question(
                            colors.yellow("You: ")
                        )
                        const newUserInput: CreateChatCompletionRequestMessage =
                            {
                                role: "user",
                                content: userInput
                            }
                        const newChatHistory = [...chatHistory, newUserInput]

                        const completion = await openai.chat.completions.create(
                            {
                                messages: newChatHistory,
                                model: openAiModel,
                                temperature: 0.8,
                                functions: gptAbstractCodeSmellFunctionsArray,
                                function_call: "auto"
                            }
                        )

                        if (isQuitMessage(userInput)) {
                            logGptResponse(completion)
                            return
                        }

                        let updatedChatHistory = newChatHistory

                        if (hasCalledFunction(completion)) {
                            logGptResponse(completion)

                            const functionName =
                                completion.choices[0].message.function_call.name
                            const functionArguments = JSON.parse(
                                completion.choices[0].message.function_call
                                    .arguments
                            )
                            const selectedFunction =
                                gptConcreteCodeSmellFunctionsRecord[
                                    functionName
                                ]
                            const functionResult = await selectedFunction(
                                functionArguments
                            )

                            logger.log(
                                colors.italic(
                                    `Function "${functionName}" Result -> ${functionResult}`
                                )
                            )

                            const functionResponseMessage: CreateChatCompletionRequestMessage =
                                {
                                    role: "assistant",
                                    content:
                                        completion?.choices[0]?.message
                                            ?.content,
                                    function_call:
                                        completion?.choices[0].message
                                            ?.function_call
                                }
                            const functionResultMessage: CreateChatCompletionRequestMessage =
                                {
                                    role: "function",
                                    name: functionName,
                                    content: JSON.stringify(functionResult)
                                }

                            updatedChatHistory = [
                                ...newChatHistory,
                                functionResponseMessage,
                                functionResultMessage
                            ]

                            const functionCallResponse =
                                await openai.chat.completions.create({
                                    messages: updatedChatHistory,
                                    model: openAiModel,
                                    temperature: 0.5
                                })

                            logGptResponse(functionCallResponse)
                        } else {
                            const assistantMessage: CreateChatCompletionRequestMessage =
                                {
                                    role: "assistant",
                                    content:
                                        completion.choices[0].message.content
                                }

                            updatedChatHistory = [
                                ...newChatHistory,
                                assistantMessage
                            ]

                            logGptResponse(completion)
                        }

                        const truncatedChatHistory =
                            updatedChatHistory.length > chatHistoryMessageLimit
                                ? removeElementsFromOffset(
                                      updatedChatHistory,
                                      2,
                                      1
                                  )
                                : updatedChatHistory

                        await chatLoop(truncatedChatHistory)
                    } catch (e) {
                        logger.error(e)
                        if (e instanceof Error) {
                            logger.error(e.stack)
                        }
                    }
                }

                await chatLoop([systemPrompt])
            })

export default findCodeSmellsCommand
