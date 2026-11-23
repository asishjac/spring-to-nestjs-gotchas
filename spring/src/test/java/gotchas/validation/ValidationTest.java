package gotchas.validation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@SpringBootTest
@AutoConfigureMockMvc
class ValidationTest {
	@Autowired MockMvc mvc;

	@Test
	void wrongType_isRejectedEvenWithoutValid() throws Exception {
		send("/validation/unchecked", "{\"productId\":\"book\",\"quantity\":\"abc\"}").andExpect(status().isBadRequest());
	}

	@Test
	void constraintViolation_isAcceptedWithoutValid() throws Exception {
		send("/validation/unchecked", "{\"productId\":\"book\",\"quantity\":0}").andExpect(status().isCreated());
	}

	@Test
	void constraintViolation_isRejectedWithValid() throws Exception {
		send("/validation/checked", "{\"productId\":\"book\",\"quantity\":0}").andExpect(status().isBadRequest());
	}

	private ResultActions send(String url, String json) throws Exception {
		return mvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json));
	}
}
