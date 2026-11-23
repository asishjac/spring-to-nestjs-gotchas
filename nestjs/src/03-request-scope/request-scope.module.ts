import { Module } from '@nestjs/common';
import { RequestContext } from './request-context';
import { ReportController, ReportService } from './request-scoped.chain';
import { StatsController, StatsService } from './singleton.chain';

@Module({
  controllers: [ReportController, StatsController],
  providers: [RequestContext, ReportService, StatsService],
})
export class RequestScopeModule {}
