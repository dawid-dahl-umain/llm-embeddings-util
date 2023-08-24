import * as dotenv from "dotenv"
import { Logger } from "@nestjs/common"
import { Command } from "commander"
import { createChat } from "completions"
import { getCountryPineconeCount, logGptResponse } from "../../utils/utils"

dotenv.config()

const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo-0613",
    functions: [
        {
            name: "getCountryPineconeCount",
            description:
                "Get the pinecone count inside any country on the planet",
            parameters: {
                type: "object",
                properties: {
                    country: {
                        type: "string",
                        description:
                            "The country of which the pinecone count should be given"
                    }
                },
                required: ["country"]
            },
            function: getCountryPineconeCount
        }
    ],
    functionCall: "auto"
})

const chatCommand =
    (logger: Logger) =>
    (program: Command): Command =>
        program
            .command("chat <query>")
            .description("Chat with GPT")
            .option("-k, --api-key <>", "OpenAI API key")
            .action(async (query: string, options: { apiKey: string }) => {
                const openAiApiKey =
                    process.env.OPENAI_API_KEY || options.apiKey

                if (!openAiApiKey) {
                    throw new Error("Couldn't get the OpenAI API Key")
                }

                if (!query) {
                    throw new Error("You need to supply a query")
                }

                try {
                    const response = await chat.sendMessage(query)

                    logGptResponse(logger)(response)
                } catch (error) {
                    logger.error(error)
                }
            })

export default chatCommand
