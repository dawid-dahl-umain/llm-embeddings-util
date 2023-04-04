import { Module } from "@nestjs/common"
import { CLIController } from "./cli.controller"
import { CLIService } from "./cli.service"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [ConfigModule],
    controllers: [CLIController],
    providers: [CLIService]
})
export class CLIModule {}
