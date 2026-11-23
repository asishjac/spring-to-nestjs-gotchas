package gotchas.validation;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/validation")
class ValidationController {

	// No @Valid: type conversion still happens, constraint annotations are ignored.
	@PostMapping("/unchecked")
	@ResponseStatus(HttpStatus.CREATED)
	CreateOrderRequest unchecked(@RequestBody CreateOrderRequest body) { return body; }

	// @Valid: Bean Validation runs and a violation becomes a 400.
	@PostMapping("/checked")
	@ResponseStatus(HttpStatus.CREATED)
	CreateOrderRequest checked(@Valid @RequestBody CreateOrderRequest body) { return body; }
}
