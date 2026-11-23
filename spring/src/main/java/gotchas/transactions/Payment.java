package gotchas.transactions;

import jakarta.persistence.*;

@Entity
public class Payment {
	@Id @GeneratedValue Long id;
	Long orderId;

	protected Payment() {}
	public Payment(Long orderId) { this.orderId = orderId; }
}
