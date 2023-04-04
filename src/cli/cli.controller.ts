import { Controller } from '@nestjs/common';
import { CLIService } from './cli.service';

@Controller('cli')
export class CLIController {
  constructor(private readonly cliService: CLIService) {}
}
