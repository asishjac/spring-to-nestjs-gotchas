package gotchas.transactions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TransactionsTest {
	@Autowired MockMvc mvc;
	@Autowired OrderRepository orders;
	@Autowired PaymentRepository payments;

	@BeforeEach
	void emptyTables() {
		payments.deleteAll();
		orders.deleteAll();
	}

	@Test
	void withoutTransaction_orderRowSurvivesTheFailedPayment() throws Exception {
		mvc.perform(post("/transactions/without/book")).andExpect(status().isInternalServerError());
		mvc.perform(get("/transactions/counts"))
				.andExpect(jsonPath("$.orders").value(1))
				.andExpect(jsonPath("$.payments").value(0));
	}

	@Test
	void withTransactional_failureRollsEverythingBack() throws Exception {
		mvc.perform(post("/transactions/with/book")).andExpect(status().isInternalServerError());
		mvc.perform(get("/transactions/counts"))
				.andExpect(jsonPath("$.orders").value(0))
				.andExpect(jsonPath("$.payments").value(0));
	}
}
