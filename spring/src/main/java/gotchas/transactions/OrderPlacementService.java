package gotchas.transactions;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderPlacementService {
	private final OrderRepository orders;
	private final PaymentRepository payments;

	OrderPlacementService(OrderRepository orders, PaymentRepository payments) {
		this.orders = orders;
		this.payments = payments;
	}

	// No @Transactional: each repository.save() commits on its own, so the order survives the failure.
	public void placeOrderWithoutTransaction(String productId) {
		OrderEntity order = orders.save(new OrderEntity(productId));
		failWhileSavingPayment(order.getId());
	}

	// One annotation. Spring's AOP proxy opens a transaction around the method and
	// rolls it back because a RuntimeException escapes.
	@Transactional
	public void placeOrderInTransaction(String productId) {
		OrderEntity order = orders.save(new OrderEntity(productId));
		failWhileSavingPayment(order.getId());
	}

	public Map<String, Long> counts() {
		return Map.of("orders", orders.count(), "payments", payments.count());
	}

	private void failWhileSavingPayment(Long orderId) {
		throw new PaymentFailedException(orderId);
	}
}
