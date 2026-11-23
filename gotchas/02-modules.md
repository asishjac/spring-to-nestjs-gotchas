# 2. Modules: no component scanning

**Spring:** `@SpringBootApplication` scans its package and sub-packages. Any `@Service` it finds
goes into one application context, and any other bean can inject it.

**Nest:** there's no scanning. Nest only creates the providers a module lists. A provider is
visible only inside its own module, **unless** that module lists it in `exports` **and** the
consumer's module lists that module in `imports`.

## The demo

`OrderService` needs `PaymentService`.

### Spring: [`modules/`](../spring/src/main/java/gotchas/modules)

```java
package gotchas.modules.payment;
@Service public class PaymentService { ... }

package gotchas.modules.order;
@Service public class OrderService {
    OrderService(PaymentService payments) { ... }   // just works, different package and all
}
```

### Nest: [`02-modules/`](../nestjs/src/02-modules)

```ts
@Module({
  providers: [PaymentService],
  exports: [PaymentService],        // 1. make it public
})
export class PaymentModule {}

@Module({
  imports: [PaymentModule],         // 2. import the module that exports it
  controllers: [OrderController],
  providers: [OrderService],        // OrderService injects PaymentService
})
export class OrderModule {}
```

Comment out `exports` in [`payment.module.ts`](../nestjs/src/02-modules/payment.module.ts)
and the app fails **at startup**:

```
Nest can't resolve dependencies of the OrderService (?). Please make sure that the argument
PaymentService at index [0] is available in the OrderModule module.
```

Removing `PaymentModule` from `imports` fails the same way.

## What surprised me as a Spring dev

- I have to register every provider and controller by hand. Nothing is discovered automatically.
- Modules are an encapsulation boundary that Spring's single application context doesn't have.
  Spring's `@Import` merges configuration, while Nest's `imports` only brings in what the other
  module exports.
- The good news is that the error comes at startup and names the missing dependency and the module.

## See it

Tests: [`ModulesTest.java`](../spring/src/test/java/gotchas/modules/ModulesTest.java) (the
wiring works without any configuration) and
[`02-modules.e2e-spec.ts`](../nestjs/test/02-modules.e2e-spec.ts), which builds a variant without
`exports` and asserts that compiling it rejects with the error above.

```bash
curl localhost:3000/modules/checkout   # {"result":"charged 42"}
```
