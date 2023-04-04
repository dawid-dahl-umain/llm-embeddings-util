import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { CLIService } from "./cli/cli.service"
import { ConfigService } from "@nestjs/config"
import { OneOrZero } from "./types"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)
    const port = configService.get<number>("PORT", 3000)
    const cliMode = configService.get<OneOrZero>("CLI_MODE", 1)

    const cliService = app.get(CLIService)

    await cliService.run(process.argv)

    console.log("cliMode", cliMode)

    if (!cliMode) {
        await app.listen(3001)
    }
}
bootstrap()
