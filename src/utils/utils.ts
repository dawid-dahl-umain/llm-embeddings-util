import * as colors from "colors"
import { Logger } from "@nestjs/common"
import { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat"
import {
    isChatCompletionMessage,
    isChatCompletionChoice,
    isChatCompletion
} from "../types"

export const isQuitMessage = (userInput: string) =>
    userInput.toLowerCase().replace(/[^\w\s]/gi, "") === "exit" ||
    userInput.toLowerCase().replace(/[^\w\s]/gi, "") === "quit"

export const hasCalledFunction = (userInput: ChatCompletion) =>
    userInput.choices[0].message.function_call &&
    userInput.choices[0].finish_reason !== "stop"

export const logGptResponseUnconfig =
    (logger: Logger, debug = false) =>
    (response: ChatCompletion | ChatCompletionMessage): void => {
        if (!logger || !response) {
            throw new Error(
                "Couldn't log the GPT response, missing either the logger or the response"
            )
        }
        if (debug) {
            if (isChatCompletion(response)) {
                logger.log(
                    colors.bold(
                        response.choices[0].message.content
                            ? `Choice: ${JSON.stringify(
                                  response.choices[0],
                                  null,
                                  2
                              )}`
                            : `"Should I maybe call a function...?" 💭 \n ${JSON.stringify(
                                  response.choices[0],
                                  null,
                                  2
                              )}`
                    )
                )
            } else if (isChatCompletionMessage(response)) {
                logger.log(
                    colors.bold(`Message: ${JSON.stringify(response, null, 2)}`)
                )
            }

            return
        }

        if (isChatCompletion(response)) {
            logger.log(
                colors.bold(
                    `${
                        response.choices[0].message.content
                            ? response.choices[0].message.content
                            : '"Should I maybe call a function...? 💭"'
                    }`
                )
            )
        } else if (isChatCompletionMessage(response)) {
            logger.log(colors.bold(`${response.content}`))
        }
    }
