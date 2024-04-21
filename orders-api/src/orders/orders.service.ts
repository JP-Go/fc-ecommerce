import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await this.productRepository.findBy({
      id: In(uniqueProductIds),
    });
    if (products.length !== uniqueProductIds.length) {
      throw new Error(
        `Algum produto não existe. Produtos pedidos: ${productIds}, Pedidos encontrados: ${products.map((product) => product.id)}`,
      );
    }
    const order = Order.create({
      clientId: 1,
      items: createOrderDto.items.map((item) => {
        const product = products.find(
          (product) => product.id === item.productId,
        );
        return {
          price: product.price,
          productId: item.productId,
          quantity: item.quantity,
        };
      }),
    });
    await this.orderRepository.save(order);
    return order;
  }

  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
    });
  }
}
