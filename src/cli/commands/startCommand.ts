import { Logger } from "@nestjs/common"
import { NestFactoryStatic } from "@nestjs/core/nest-factory"
import { Command } from "commander"
import { AppModule } from "src/app.module"

const startCommand =
    (nestFactory: NestFactoryStatic, appModule: AppModule, logger: Logger) =>
    (program: Command, port: number): Command =>
        program
            .command("start")
            .description("Start the NestJS server")
            .action(async () => {
                const app = await nestFactory.create(appModule)

                await app.listen(port)

                logger.log(
                    `App is in CLI-mode and listening at port -> ${port}`
                )
            })

export default startCommand
