package gotchas.modules;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ModulesTest {
	@Autowired MockMvc mvc;

	@Test
	void serviceInAnotherPackageIsInjectedWithoutAnyWiring() throws Exception {
		mvc.perform(get("/modules/checkout"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.result").value("charged 42"));
	}
}
