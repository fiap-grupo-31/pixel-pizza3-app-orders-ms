/* eslint-disable prefer-promise-reject-errors */
import { OrdersItens } from '../../domain/entities/OrdersItens';
import { type OrdersItensGatewayInterface } from '../../domain/interfaces/OrdersItensGatewayInterface';

class OrdersItensUseCases {
  static async getOrdersItensAll (
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<OrdersItens[] | null> {
    return await ordersItensGateway.findAll();
  }

  static async getOrdersItensById (
    id: string,
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<OrdersItens | null> {
    return await ordersItensGateway.findId(id);
  }

  static async getOrdersItensByOrderId (
    reference: Record<string, any> = {},
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<OrdersItens[] | null> {
    return await ordersItensGateway.find(reference);
  }

  static async setOrdersItens (
    orderId: string,
    productId: string,
    price: number,
    quantity: number,
    obs: string,
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<OrdersItens | null> {
    if (orderId.length !== 24 || !await ordersItensGateway.isValidId(orderId)) {
      throw new Error('orderId inválid');
    }

    if (productId.length !== 24 || !await ordersItensGateway.isValidId(productId)) {
      throw new Error('productId inválid');
    }

    try {
      const orders = await ordersItensGateway.persist(
        orderId,
        productId,
        price,
        quantity,
        obs
      );
      return new OrdersItens(
        orders._id,
        orders.orderId,
        orders.productId,
        orders.price,
        orders.quantity,
        orders.obs,
        orders.created_at,
        orders.updated_at
      );
    } catch (error) {
      throw new Error('failure insert');
    }
  }

  static async updateOrdersItens (
    id: string,
    price: number,
    quantity: number,
    obs: string,
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<OrdersItens | null> {
    try {
      const orders = await ordersItensGateway.update(
        id,
        price,
        quantity,
        obs
      );
      return new OrdersItens(
        orders._id,
        orders.orderId,
        orders.productId,
        orders.price,
        orders.quantity,
        orders.obs,
        orders.created_at,
        orders.updated_at
      );
    } catch (error) {
      throw new Error('failure update');
    }
  }

  static async removeOrdersItensById (
    id: string,
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<any> {
    try {
      await ordersItensGateway.remove(id);
      return await Promise.resolve('removed');
    } catch (error) {
      throw new Error('id inexistent');
    }
  }

  static async removeOrdersItensByOrderId (
    id: string,
    ordersItensGateway: OrdersItensGatewayInterface
  ): Promise<any> {
    try {
      await ordersItensGateway.removeFind({
        orderId: id
      });
      return await Promise.resolve('removed');
    } catch (error) {
      throw new Error('id inexistent');
    }
  }
}

export { OrdersItensUseCases };
