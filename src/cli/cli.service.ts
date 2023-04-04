import { Injectable } from "@nestjs/common"
import { Command } from "commander"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class CLIService {
    private program: Command
    private port: number

    constructor(private readonly configService: ConfigService) {
        this.program = new Command()
        this.port = this.configService.get<number>("PORT", 3000)
        this.setupCommands()
    }

    private setupCommands(): void {
        this.program
            .command("start")
            .description("Start the NestJS server")
            .action(async () => {
                const app = await NestFactory.create(AppModule)
                await app.listen(this.port)
                console.log(`NestJS server started on port ${this.port}`)
            })
    }

    public async run(args: string[]): Promise<void> {
        await this.program.parseAsync(args)
    }
}
