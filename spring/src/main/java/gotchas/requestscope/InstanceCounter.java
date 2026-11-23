package gotchas.requestscope;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

// Gives every constructed instance a sequential id per class, so we can see when Spring builds a new one.
final class InstanceCounter {
	private static final Map<String, AtomicInteger> COUNTERS = new ConcurrentHashMap<>();

	static int nextId(String className) {
		return COUNTERS.computeIfAbsent(className, k -> new AtomicInteger()).incrementAndGet();
	}
}
