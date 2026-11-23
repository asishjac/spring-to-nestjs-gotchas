import { Injectable, Scope } from '@nestjs/common';
import { nextId } from './instance-counter';

// The only provider we explicitly mark as request-scoped.
@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  readonly id = nextId('RequestContext');
}
