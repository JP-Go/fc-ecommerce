import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export type CreateOrderCommand = {
  clientId: number;
  items: {
    productId: string;
    price: number;
    quantity: number;
  }[];
};

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    name: 'client_id',
  })
  clientId: number;

  @Column()
  state: OrderStatus = OrderStatus.PENDING;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];

  static create(input: CreateOrderCommand): Order {
    const order = new Order();
    order.clientId = input.clientId;
    order.items = input.items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.productId = item.productId;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      return orderItem;
    });
    order.total = order.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    return order;
  }
}
