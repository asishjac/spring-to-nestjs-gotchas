package gotchas.requestscope;

import java.util.Map;
import org.springframework.stereotype.Service;

// A plain singleton. It holds the RequestContext proxy, so it does NOT become request-scoped.
@Service
public class ReportService {
	private final int id = InstanceCounter.nextId("ReportService");
	private final RequestContext ctx;

	ReportService(RequestContext ctx) { this.ctx = ctx; }

	public Map<String, Integer> ids() {
		return Map.of("requestContextId", ctx.getId(), "serviceId", id);
	}
}
