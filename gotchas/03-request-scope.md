# 3. Request scope bubbles up to the controller

**Spring:** a `@RequestScope` bean injected into a singleton goes through a scoped proxy. The
singleton stays a singleton, and each call on the proxy reaches the current request's instance.

**Nest:** there are no proxies. A provider that injects a `Scope.REQUEST` provider becomes
request-scoped too, and so does everything that injects *it*, up to the controller. Every
request creates the whole chain again.

## The demo

Each class gets a sequential instance id from its constructor. The endpoint returns all three
ids, and we call it twice.

```
RequestContext (request-scoped)  ←  ReportService  ←  ReportController
```

### Spring: [`requestscope/`](../spring/src/main/java/gotchas/requestscope)

```java
@Component @RequestScope            // proxyMode = TARGET_CLASS by default
public class RequestContext { ... }

@Service                            // singleton, holds the proxy
public class ReportService { ReportService(RequestContext ctx) { ... } }
```

### Nest: [`03-request-scope/`](../nestjs/src/03-request-scope)

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestContext { ... }

@Injectable()                       // no scope set...
export class ReportService { constructor(private readonly ctx: RequestContext) {} }
```

### Results of two requests

| | Spring (1st → 2nd) | Nest (1st → 2nd) |
|---|---|---|
| `requestContextId` | 1 → 2 | 1 → 2 |
| `serviceId` | 1 → **1** | 1 → **2** |
| `controllerId` | 1 → **1** | 1 → **2** |

For contrast, the Nest app also has a chain with nothing request-scoped in it
(`StatsService` ← `StatsController`, [`singleton.chain.ts`](../nestjs/src/03-request-scope/singleton.chain.ts)),
and those ids stay at 1.

## What surprised me as a Spring dev

- One `Scope.REQUEST` on a low-level provider silently changes the lifecycle of everything above it.
- The NestJS guide's advice is to keep providers singletons and read per-request data, such as
  the user or tenant, from `AsyncLocalStorage`, which plays the role of a `ThreadLocal`.

## See it

Tests: [`RequestScopeTest.java`](../spring/src/test/java/gotchas/requestscope/RequestScopeTest.java),
[`03-request-scope.e2e-spec.ts`](../nestjs/test/03-request-scope.e2e-spec.ts).

```bash
curl localhost:3000/request-scope/request-scoped   # call twice and watch every id change
curl localhost:3000/request-scope/singleton        # Nest only: ids stay the same
curl localhost:8080/request-scope/request-scoped   # Spring: only requestContextId changes
```
