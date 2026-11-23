package gotchas.modules.payment;

import org.springframework.stereotype.Service;

// No module, no export list. Component scanning finds it and any bean can inject it.
@Service
public class PaymentService {
	public String charge(int amount) { return "charged " + amount; }
}
