import * as dotenv from "dotenv"
import { Logger } from "@nestjs/common"
import { Command } from "commander"
import { createChat } from "completions"

dotenv.config()

const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo-0613"
})

console.log("chat", chat)

const chatCommand =
    (logger: Logger) =>
    (program: Command): Command =>
        program
            .command("chat <query>")
            .description("Chat with GPT")
            .option("-k, --api-key <key>", "OpenAI API key")
            .action((x, y) => {
                const openAiApiKey = process.env.OPENAI_API_KEY

                if (!openAiApiKey) {
                    throw new Error("Couldn't get the OpenAI API Key")
                }

                const options = program.opts()

                console.log(
                    "process.env.OPENAI_API_KEY -> ",
                    process.env.OPENAI_API_KEY
                )
                console.log("x -> ", x)
                console.log("y -> ", y)
                console.log("options -> ", options)

                logger.log(`${x}`)
            })

export default chatCommand
