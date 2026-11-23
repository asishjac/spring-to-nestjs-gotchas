# 4. Validation: types vanish at runtime

**Spring:** `@Valid @RequestBody` runs Bean Validation. Even without `@Valid`, Java types are real
at runtime: Jackson refuses to put `"abc"` into an `Integer` and Spring answers `400`.

**Nest:** TypeScript types are erased during compilation. Without a validation pipe,
`@Body() dto: CreateOrderDto` receives whatever JSON the client sent. The class-validator
decorators only store metadata, and nothing reads them until a `ValidationPipe` runs.

## The demo

### Spring: [`validation/`](../spring/src/main/java/gotchas/validation)

```java
public record CreateOrderRequest(@NotBlank String productId, @NotNull @Min(1) Integer quantity) {}

@PostMapping("/unchecked") ... (@RequestBody CreateOrderRequest body)
@PostMapping("/checked")   ... (@Valid @RequestBody CreateOrderRequest body)
```

### Nest: [`04-validation/`](../nestjs/src/04-validation)

```ts
export class CreateOrderDto {
  @IsString() productId: string;
  @IsInt() @Min(1) quantity: number;
}

// main.ts: on only when VALIDATION=on
app.useGlobalPipes(new ValidationPipe());
```

### Results

| Body | Spring, no `@Valid` | Spring, `@Valid` | Nest, no pipe | Nest, `ValidationPipe` |
|---|---|---|---|---|
| `{"quantity":"abc"}` | 400 (Jackson: not an Integer) | 400 | **201**, `quantity` is a string | 400 |
| `{"productId":"book","quantity":0}` | **201** (constraints ignored) | 400 | 201 | 400 |

## What surprised me as a Spring dev

- In Spring, forgetting `@Valid` skips the constraints but still enforces the types. In Nest,
  forgetting the pipe skips **both**. `quantity: number` can hold `"abc"` at runtime.
- The fix is a single global line, and Nest doesn't add it by default.
- Same idea elsewhere: route and query params always arrive as strings unless a pipe such as
  `ParseIntPipe` converts them.

## See it

Tests: [`ValidationTest.java`](../spring/src/test/java/gotchas/validation/ValidationTest.java),
[`04-validation.e2e-spec.ts`](../nestjs/test/04-validation.e2e-spec.ts).

```bash
# Nest: npm run start:dev (pipe OFF), then npm run start:dev:validated (pipe ON)
curl -X POST localhost:3000/validation/orders -H 'content-type: application/json' -d '{"quantity":"abc"}'

# Spring
curl -X POST localhost:8080/validation/unchecked -H 'content-type: application/json' -d '{"productId":"book","quantity":0}'   # 201
curl -X POST localhost:8080/validation/checked   -H 'content-type: application/json' -d '{"productId":"book","quantity":0}'   # 400
```
