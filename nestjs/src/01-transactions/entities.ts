import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn() id: number;
  @Column() productId: string;
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn() id: number;
  @Column() orderId: number;
}
