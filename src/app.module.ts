import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CLIModule } from './cli/cli.module';

@Module({
  imports: [CLIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
