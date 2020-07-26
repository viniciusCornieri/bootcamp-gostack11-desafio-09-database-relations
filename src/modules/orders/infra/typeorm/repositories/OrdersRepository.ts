import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({ customer });

    const order_products = products.map(p => {
      const orderProduct = new OrdersProducts();
      Object.assign(orderProduct, p);
      return orderProduct;
    });

    order.order_products = order_products;

    return this.ormRepository.save(order);
  }

  public async findById(id: string): Promise<Order | undefined> {
    return this.ormRepository.findOne(id);
  }
}

export default OrdersRepository;
