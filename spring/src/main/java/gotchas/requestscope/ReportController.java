package gotchas.requestscope;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/request-scope")
class ReportController {
	private final int id = InstanceCounter.nextId("ReportController");
	private final ReportService reports;

	ReportController(ReportService reports) { this.reports = reports; }

	@GetMapping("/request-scoped")
	Map<String, Integer> get() {
		Map<String, Integer> body = new HashMap<>(reports.ids());
		body.put("controllerId", id);
		return body;
	}
}
