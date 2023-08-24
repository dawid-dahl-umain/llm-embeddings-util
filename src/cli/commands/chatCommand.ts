import * as dotenv from "dotenv"
import { Logger } from "@nestjs/common"
import { Command } from "commander"
import { getCountryPineconeCount } from "../../utils/utils"
import OpenAI from "openai"

dotenv.config()

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

                const openai = new OpenAI({
                    apiKey: openAiApiKey
                })

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: query }],
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
                            }
                        }
                    ]
                })

                logger.log(completion.choices)
            })

export default chatCommand
