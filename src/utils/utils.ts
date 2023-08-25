import * as colors from "colors"
import { Logger } from "@nestjs/common"
import { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat"
import { isChatCompletionMessage, isChatCompletionChoice } from "../types"

export const getCountryPineconeCount = async (
    country: "string"
): Promise<number> => {
    if (!country) {
        throw new Error(
            "A country needs to be specified for pinecone count to be calculated"
        )
    }

    return Promise.resolve(Math.floor(Math.random() * 10))
}

export const logGptResponseUnconfig =
    (logger: Logger, debug = false) =>
    (response: ChatCompletion.Choice | ChatCompletionMessage): void => {
        if (!logger || !response) {
            throw new Error(
                "Couldn't log the GPT response, missing either the logger or the response"
            )
        }

        if (debug) {
            console.log(11111)
            if (isChatCompletionChoice(response)) {
                logger.log(
                    colors.bold("Choice:" + JSON.stringify(response, null, 2))
                )
            } else if (isChatCompletionMessage(response)) {
                logger.log(
                    colors.bold("Message:" + JSON.stringify(response, null, 2))
                )
            }

            return
        }

        if (isChatCompletionChoice(response)) {
            logger.log(colors.bold(`${response.message.content}`))
        } else if (isChatCompletionMessage(response)) {
            logger.log(colors.bold(`${response.content}`))
        }
    }
