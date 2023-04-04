import { Injectable } from '@nestjs/common';
import { Command } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

@Injectable()
export class CLIService {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .command('start')
      .description('Start the NestJS server')
      .action(async () => {
        const app = await NestFactory.create(AppModule);
        await app.listen(3000);
        console.log('NestJS server started on port 3000');
      });

    // Add more commands and options as needed
  }

  public async run(args: string[]): Promise<void> {
    await this.program.parseAsync(args);
  }
}
