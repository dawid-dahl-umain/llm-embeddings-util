import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { CLIService } from "./cli/cli.service"
import { ConfigService } from "@nestjs/config"
import { OneOrZero } from "./types"
import { Logger } from "@nestjs/common"

async function bootstrap() {
    const logger = new Logger("Bootstrap")

    const app = await NestFactory.create(AppModule)

    app.useLogger(logger)

    const configService = app.get(ConfigService)
    const port = configService.get<number>("PORT", 3000)
    const cliMode = configService.get<OneOrZero>("CLI_MODE", 1)

    if (!cliMode || !port) {
        logger.error(
            "Could not get the env variables needed to boot up the app."
        )

        return
    }

    if (Number(cliMode) === 1) {
        const cliService = app.get(CLIService)

        await cliService.run()

        return
    }

    if (Number(cliMode) === 0) {
        logger.log(`App is listening at port -> ${port}`)

        await app.listen(3001)
    }
}

bootstrap()
