package gotchas.modules.order;

import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/modules")
class OrderController {
	private final OrderService orders;

	OrderController(OrderService orders) { this.orders = orders; }

	@GetMapping("/checkout")
	Map<String, String> checkout() { return orders.checkout(); }
}
