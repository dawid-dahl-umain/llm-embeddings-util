import { Injectable, Logger } from "@nestjs/common"
import { Command } from "commander"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { ConfigService } from "@nestjs/config"
import startCommand from "./commands/startCommand"

@Injectable()
export class CLIService {
    constructor(private readonly configService: ConfigService) {
        this.program = new Command()
        this.port = this.configService.get<number>("PORT", 3000)
        this.setupCommands()
    }

    private readonly logger = new Logger(CLIService.name)
    private readonly program: Command
    private readonly port: number

    private setupCommands(): void {
        const start = startCommand(NestFactory, AppModule, this.logger)

        start(this.program, this.port)
    }

    public async run(args: string[]): Promise<void> {
        await this.program.parseAsync(args)
    }
}
