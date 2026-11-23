package gotchas.transactions;

import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
class TransactionsController {
	private final OrderPlacementService service;

	TransactionsController(OrderPlacementService service) { this.service = service; }

	// Both endpoints return 500 because the payment step throws. What differs is what's left in the DB.
	@PostMapping("/without/{productId}")
	void without(@PathVariable String productId) { service.placeOrderWithoutTransaction(productId); }

	@PostMapping("/with/{productId}")
	void with(@PathVariable String productId) { service.placeOrderInTransaction(productId); }

	@GetMapping("/counts")
	Map<String, Long> counts() { return service.counts(); }
}
