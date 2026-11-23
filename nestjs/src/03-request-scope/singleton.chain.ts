import { Controller, Get, Injectable } from '@nestjs/common';
import { nextId } from './instance-counter';

// Same shape as request-scoped.chain.ts but nothing request-scoped is injected: both stay singletons.
@Injectable()
export class StatsService {
  readonly id = nextId('StatsService');

  ids() {
    return { serviceId: this.id };
  }
}

@Controller('request-scope')
export class StatsController {
  readonly id = nextId('StatsController');
  constructor(private readonly stats: StatsService) {}

  @Get('singleton')
  get() {
    return { controllerId: this.id, ...this.stats.ids() };
  }
}
