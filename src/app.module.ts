import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CLIModule } from "./cli/cli.module"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [ConfigModule.forRoot(), CLIModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
