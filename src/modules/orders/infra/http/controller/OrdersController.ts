import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    throw new Error('not implemented yet');
  }

  public async create(request: Request, response: Response): Promise<Response> {
    throw new Error('not implemented yet');
  }
}
