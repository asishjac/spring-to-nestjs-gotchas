# 1. Transactions: no `@Transactional`

**Spring:** put `@Transactional` on a service method. Spring wraps the bean in an AOP proxy that
opens a transaction and rolls it back if a `RuntimeException` escapes.

**Nest:** there is no `@Transactional` and no general-purpose AOP. Interceptors wrap route
handlers, not arbitrary service methods. With TypeORM, you run the queries inside a callback
that commits when it resolves and rolls back when it throws.

## The demo

`placeOrder` saves an order and then fails while saving the payment. There are two variants:

- `without`: no transaction, so the order row stays behind.
- `with`: in a transaction, so nothing is persisted.

### Spring: [`OrderPlacementService.java`](../spring/src/main/java/gotchas/transactions/OrderPlacementService.java)

```java
public void placeOrderWithoutTransaction(String productId) {
    OrderEntity order = orders.save(new OrderEntity(productId)); // commits on its own
    failWhileSavingPayment(order.getId());
}

@Transactional
public void placeOrderInTransaction(String productId) {
    OrderEntity order = orders.save(new OrderEntity(productId));
    failWhileSavingPayment(order.getId());                        // → rollback
}
```

### Nest: [`transactions.service.ts`](../nestjs/src/01-transactions/transactions.service.ts)

```ts
async placeOrderWithoutTransaction(productId: string) {
  const order = await this.orders.save({ productId });            // commits on its own
  await this.failWhileSavingPayment(order.id);
}

async placeOrderInTransaction(productId: string) {
  await this.dataSource.transaction(async (manager) => {
    const order = await manager.save(Order, { productId });
    await this.failWhileSavingPayment(order.id);                  // → rollback
  });
}
```

## What surprised me as a Spring dev

- The transaction boundary moves out of an annotation and into the method body.
- Inside the callback, writes must go through `manager`, the transaction-bound EntityManager.
  That's the object TypeORM hands you, not the repositories injected in the constructor.
- I can't build my own `@Transactional` with an interceptor, because interceptors only wrap
  route handlers.

## See it

Tests: [`TransactionsTest.java`](../spring/src/test/java/gotchas/transactions/TransactionsTest.java),
[`01-transactions.e2e-spec.ts`](../nestjs/test/01-transactions.e2e-spec.ts). Both assert
`{orders: 1, payments: 0}` without a transaction and `{orders: 0, payments: 0}` with one.

Manually, after restarting the app so the in-memory DB is empty (port 8080 for Spring, 3000 for Nest):

```bash
curl -X POST localhost:3000/transactions/without/book   # 500
curl -X POST localhost:3000/transactions/with/book      # 500
curl localhost:3000/transactions/counts                 # {"orders":1,"payments":0}  ← only the first one left a row
```
