import { Injectable, Logger } from "@nestjs/common"
import { Command } from "commander"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { ConfigService } from "@nestjs/config"
import startCommand from "./commands/startCommand"
import exclaimCommand from "./commands/exclaimCommand"
import chatCommand from "./commands/chatCommand"

@Injectable()
export class CLIService {
    private readonly logger = new Logger(CLIService.name)
    private readonly program: Command
    private readonly port: number

    constructor(private readonly configService: ConfigService) {
        this.program = new Command()
        this.port = this.configService.get<number>("PORT", 3000)
        this.setupCommands()
    }

    private setupCommands(): void {
        const start = startCommand(NestFactory, AppModule, this.logger)
        const exclaim = exclaimCommand(this.logger)
        const chat = chatCommand(this.logger)

        start(this.program, this.port)
        exclaim(this.program)
        chat(this.program)
    }

    public async run(): Promise<void> {
        this.program.parse(process.argv)
    }
}
