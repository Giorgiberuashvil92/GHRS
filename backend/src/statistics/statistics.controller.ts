import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('global')
  async getGlobalStatistics() {
    return this.statisticsService.getGlobalStatistics();
  }
} 