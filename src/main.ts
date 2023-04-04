import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIService } from './cli/cli.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cliService = app.get(CLIService);

  await cliService.run(process.argv);

  await app.listen(3000);
}
bootstrap();
