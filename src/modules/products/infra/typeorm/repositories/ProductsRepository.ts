import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    return this.ormRepository.save(product);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({
      where: {
        name,
      },
    });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    return this.ormRepository.findByIds(products);
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsIdQuantityMap: Record<string, number> = {};
    products.forEach(p =>
      Object.assign(productsIdQuantityMap, { [p.id]: p.quantity }),
    );

    const foundProducts = await this.ormRepository.findByIds(
      Object.keys(productsIdQuantityMap),
    );

    const updatedProducts = foundProducts.map(p => ({
      ...p,
      quantity: p.quantity - productsIdQuantityMap[p.id],
    }));

    return this.ormRepository.save(updatedProducts);
  }
}

export default ProductsRepository;
