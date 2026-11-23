# Spring Boot → NestJS: four behaviours that differ

After years of Spring Boot I started learning NestJS. Most of the syntax maps cleanly:
`@Controller`, `@Injectable`, constructor injection, decorators that read like annotations.
Some of the **behaviour** doesn't.

This repo implements the **same four demos in both frameworks**, with a test for each one that
proves the behaviour. Run them side by side and compare what happens.

> Source for the Nest side: the official NestJS guide
> [Coming from Spring Boot](https://docs.nestjs.com/migrating/spring-boot).
> I only claim what the code here demonstrates or what that guide states.

## The four gotchas at a glance

| # | Gotcha | Spring Boot | NestJS |
|---|--------|-------------|--------|
| 1 | [Transactions](gotchas/01-transactions.md) | `@Transactional` on any bean method rolls back on failure | No `@Transactional` and no general AOP. Use a `dataSource.transaction()` callback |
| 2 | [Modules](gotchas/02-modules.md) | Component scanning: any `@Service` can be injected anywhere | A provider is private to its module unless it's **exported** and the module is **imported** |
| 3 | [Request scope](gotchas/03-request-scope.md) | A request-scoped bean reaches singletons through a proxy | The consumer becomes request-scoped too, all the way up to the controller |
| 4 | [Validation](gotchas/04-validation.md) | Java types exist at runtime, and `@Valid` runs Bean Validation | TS types are erased, so without `ValidationPipe` the body is unchecked |

## What you'll see when you run it

These responses come from the two running apps (Spring on `:8080`, Nest on `:3000`), with the
same requests sent to each.

### 1. Transactions: the result is the same, the mechanism isn't

Both endpoints save an order and then fail on purpose while saving the payment (HTTP 500).

```text
POST /transactions/without/book  → 500
POST /transactions/with/book     → 500
GET  /transactions/counts        → {"orders":1,"payments":0}    ← Spring and Nest alike
```

Only the call without a transaction left a row behind. Spring gets the rollback from
`@Transactional`, and Nest from `this.dataSource.transaction(async (manager) => { ... })`.

### 2. Modules: explicit wiring vs scanning

```text
GET /modules/checkout → {"result":"charged 42"}    ← both
```

Spring finds `PaymentService` by classpath scanning. Nest only resolves it because `PaymentModule`
has `exports: [PaymentService]` and `OrderModule` has `imports: [PaymentModule]`. Remove either
and Nest fails **at startup**:

```text
Nest can't resolve dependencies of the OrderService (?). Please make sure that the argument
PaymentService at index [0] is available in the OrderModule module.
```

### 3. Request scope: the biggest difference

`RequestContext` (request-scoped) ← `ReportService` ← `ReportController`. Each class records an
instance id in its constructor. Here is the same endpoint called twice:

```text
SPRING  call 1 → requestContext 1, service 1, controller 1
        call 2 → requestContext 2, service 1, controller 1    ← only the request bean is new
NEST    call 1 → requestContext 1, service 1, controller 1
        call 2 → requestContext 2, service 2, controller 2    ← the whole chain was rebuilt
```

### 4. Validation: types vanish at runtime

```text
SPRING  no @Valid,  {"quantity":"abc"}  → 400   Jackson won't put "abc" in an Integer
SPRING  no @Valid,  {"quantity":0}      → 201   but @Min(1) is ignored
SPRING  @Valid,     {"quantity":0}      → 400
NEST    pipe OFF,   {"quantity":"abc"}  → 201   {"quantityType":"string"}  ← a "number" holding a string
NEST    pipe ON,    {"quantity":"abc"}  → 400   "quantity must be an integer number", ...
```

Each [gotcha page](gotchas) has the Spring code next to the Nest code, notes on what surprised
me as a Spring developer, and the `curl` commands to reproduce it.

## Run it yourself

### Prerequisites

| Side | Needs | Notes |
|------|-------|-------|
| Spring | **JDK 25** | Maven wrapper included, so no Maven install needed |
| NestJS | **Node.js 24.9+** | `nestjs/.nvmrc` pins 26 (LTS). NestJS 12 ships as ES modules, and Jest needs 24.9+ to load them |

Both sides use in-memory databases (H2 / SQLite), so there's nothing to set up, and every restart
starts empty.

### Spring Boot (port 8080)

```bash
cd spring
./mvnw test              # 7 tests, one class per gotcha
./mvnw spring-boot:run
```

### NestJS (port 3000)

```bash
cd nestjs
npm install
npm test                       # 9 tests, one file per gotcha
npm run start:dev              # ValidationPipe OFF (Nest's default)
npm run start:dev:validated    # ValidationPipe ON  (VALIDATION=on)
```

### Try it

```bash
# 1. Transactions: restart the app first so the DB is empty
curl -X POST localhost:3000/transactions/without/book
curl -X POST localhost:3000/transactions/with/book
curl localhost:3000/transactions/counts

# 2. Modules
curl localhost:3000/modules/checkout

# 3. Request scope: run it twice and compare the ids
curl localhost:3000/request-scope/request-scoped

# 4. Validation (Nest)
curl -X POST localhost:3000/validation/orders -H 'content-type: application/json' -d '{"quantity":"abc"}'
```

Replace `3000` with `8080` for Spring. Spring's validation endpoints are
`/validation/unchecked` and `/validation/checked`.

## Project layout

```text
.
├── gotchas/                  one page per gotcha: Spring vs Nest code, surprises, how to see it
│   ├── 01-transactions.md
│   ├── 02-modules.md
│   ├── 03-request-scope.md
│   └── 04-validation.md
├── spring/                   Spring Boot 4.2 · Java 25 · Spring Data JPA + H2 · Bean Validation
│   └── src/
│       ├── main/java/gotchas/{transactions, modules, requestscope, validation}
│       └── test/java/gotchas/  one MockMvc test class per gotcha
└── nestjs/                   NestJS 12 · TypeScript · TypeORM + SQLite · class-validator
    ├── src/{01-transactions, 02-modules, 03-request-scope, 04-validation}
    └── test/                 one supertest e2e spec per gotcha
```

| Gotcha | Spring code | Nest code | Spring test | Nest test |
|---|---|---|---|---|
| 1 | [`transactions/`](spring/src/main/java/gotchas/transactions) | [`01-transactions/`](nestjs/src/01-transactions) | [`TransactionsTest`](spring/src/test/java/gotchas/transactions/TransactionsTest.java) | [`01-transactions.e2e-spec.ts`](nestjs/test/01-transactions.e2e-spec.ts) |
| 2 | [`modules/`](spring/src/main/java/gotchas/modules) | [`02-modules/`](nestjs/src/02-modules) | [`ModulesTest`](spring/src/test/java/gotchas/modules/ModulesTest.java) | [`02-modules.e2e-spec.ts`](nestjs/test/02-modules.e2e-spec.ts) |
| 3 | [`requestscope/`](spring/src/main/java/gotchas/requestscope) | [`03-request-scope/`](nestjs/src/03-request-scope) | [`RequestScopeTest`](spring/src/test/java/gotchas/requestscope/RequestScopeTest.java) | [`03-request-scope.e2e-spec.ts`](nestjs/test/03-request-scope.e2e-spec.ts) |
| 4 | [`validation/`](spring/src/main/java/gotchas/validation) | [`04-validation/`](nestjs/src/04-validation) | [`ValidationTest`](spring/src/test/java/gotchas/validation/ValidationTest.java) | [`04-validation.e2e-spec.ts`](nestjs/test/04-validation.e2e-spec.ts) |

## Caveats

- This is a learning repo, not a best-practice guide. Each demo is deliberately small and
  shows one behaviour.
- The Nest side uses TypeORM because the NestJS guide maps Spring Data JPA to it. Other ORMs
  (Prisma, MikroORM, Drizzle) handle transactions their own way.
- For request-scoped data, the NestJS guide recommends keeping providers as singletons and
  reading per-request values from `AsyncLocalStorage` instead.

## License

[MIT](LICENSE) © Asish Jacob
