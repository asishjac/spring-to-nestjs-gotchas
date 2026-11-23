import { Controller, Get, Injectable } from '@nestjs/common';
import { nextId } from './instance-counter';
import { RequestContext } from './request-context';

// No scope set here, but because it injects RequestContext it becomes request-scoped too.
@Injectable()
export class ReportService {
  readonly id = nextId('ReportService');
  constructor(private readonly ctx: RequestContext) {}

  ids() {
    return { requestContextId: this.ctx.id, serviceId: this.id };
  }
}

// No scope set here either. It injects ReportService, so the scope bubbles up to the controller.
@Controller('request-scope')
export class ReportController {
  readonly id = nextId('ReportController');
  constructor(private readonly reports: ReportService) {}

  @Get('request-scoped')
  get() {
    return { controllerId: this.id, ...this.reports.ids() };
  }
}
