import { inject, injectable, container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customer_id,
    products: productsIds,
  }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exist');
    }

    const foundProducts = await this.productsRepository.findAllById(
      productsIds,
    );

    if (foundProducts.length !== productsIds.length) {
      const notFoundProducts = foundProducts.filter(
        p => !productsIds.find(pId => pId.id === p.id),
      );
      throw new AppError(
        `Has some product that does not exist: ${notFoundProducts}`,
      );
    }

    const productsOrderQuantity: Record<string, number> = {};
    productsIds.forEach(p =>
      Object.assign(productsOrderQuantity, { [p.id]: p.quantity }),
    );

    foundProducts.forEach(p => {
      if (productsOrderQuantity[p.id] > p.quantity)
        throw new AppError(`${p.name} has not sufficient items in stock`);
    });

    const products = foundProducts.map(p => ({
      product_id: p.id,
      price: p.price,
      quantity: productsOrderQuantity[p.id],
    }));

    const order = await this.ordersRepository.create({
      customer,
      products,
    });

    return order;
  }
}

export default CreateOrderService;
