package gotchas.requestscope;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class RequestScopeTest {
	@Autowired MockMvc mvc;

	@Test
	void onlyTheRequestScopedBeanIsRebuilt_serviceAndControllerStaySingletons() throws Exception {
		String first = call();
		String second = call();

		assertThat(id(second, "requestContextId")).isNotEqualTo(id(first, "requestContextId"));
		assertThat(id(second, "serviceId")).isEqualTo(id(first, "serviceId"));
		assertThat(id(second, "controllerId")).isEqualTo(id(first, "controllerId"));
	}

	private String call() throws Exception {
		return mvc.perform(get("/request-scope/request-scoped")).andReturn().getResponse().getContentAsString();
	}

	private int id(String json, String field) {
		return JsonPath.read(json, "$." + field);
	}
}
