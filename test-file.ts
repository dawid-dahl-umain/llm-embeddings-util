import { Command } from "commander"

const program = new Command()
program
    .command("chat <query>")
    .option("-k, --key <key>", "OpenAI API key")
    .action((query, options) => {
        console.log("Query:", query)
        console.log("Options:", options)
        console.log("Key:", options.key)
    })

program.parse(process.argv)
