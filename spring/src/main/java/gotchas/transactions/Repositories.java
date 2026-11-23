package gotchas.transactions;

import org.springframework.data.jpa.repository.JpaRepository;

interface OrderRepository extends JpaRepository<OrderEntity, Long> {}

interface PaymentRepository extends JpaRepository<Payment, Long> {}
