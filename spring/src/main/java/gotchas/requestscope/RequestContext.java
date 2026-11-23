package gotchas.requestscope;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// @RequestScope defaults to proxyMode = TARGET_CLASS: consumers get a proxy that
// looks up the current request's instance on every call.
@Component
@RequestScope
public class RequestContext {
	private final int id = InstanceCounter.nextId("RequestContext");

	public int getId() { return id; }
}
