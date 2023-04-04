import { Logger } from "@nestjs/common"
import { Command } from "commander"

const exclaimCommand =
    (logger: Logger) =>
    (program: Command): Command =>
        program
            .command("exclaim <input>")
            .description("Add an exclamation mark after the input")
            .action((input: string) => {
                logger.log(`${input}!`)
            })

export default exclaimCommand
