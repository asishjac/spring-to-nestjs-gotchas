package gotchas.modules.order;

import gotchas.modules.payment.PaymentService;
import java.util.Map;
import org.springframework.stereotype.Service;

// Lives in a different package from PaymentService and declares nothing about where it comes from.
@Service
public class OrderService {
	private final PaymentService payments;

	OrderService(PaymentService payments) { this.payments = payments; }

	public Map<String, String> checkout() { return Map.of("result", payments.charge(42)); }
}
