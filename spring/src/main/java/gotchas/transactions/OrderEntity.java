package gotchas.transactions;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class OrderEntity {
	@Id @GeneratedValue Long id;
	String productId;

	protected OrderEntity() {}
	public OrderEntity(String productId) { this.productId = productId; }
	public Long getId() { return id; }
}
