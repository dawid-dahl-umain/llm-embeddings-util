import { Logger } from "@nestjs/common"
import { Choice } from "completions/dist/createCompletions"

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

export const logGptResponse =
    (logger: Logger) =>
    (response: Choice): void => {
        if (!logger || !response) {
            throw new Error(
                "Couldn't log the GPT response, missing either the logger or the response"
            )
        }

        logger.debug(
            `Response object ----->: ${JSON.stringify(response, null, 4)}`
        )
        logger.log(`Response: ${response.content}`)
    }
