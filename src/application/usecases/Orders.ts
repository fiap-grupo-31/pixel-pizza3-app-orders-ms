/* eslint-disable prefer-promise-reject-errors */
import { Orders } from '../../domain/entities/Orders';
import { type OrdersGatewayInterface } from '../../domain/interfaces/OrdersGatewayInterface';

class OrdersUseCases {
  static async getOrdersAll (
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders[] | null> {
    return await ordersGateway.findAll();
  }

  static async getOrdersByStatus (
    reference: Record<string, any> = {},
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders[] | null> {
    return await ordersGateway.find(reference);
  }

  static async getOrdersById (
    id: string,
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders | null> {
    return await ordersGateway.findId(id);
  }

  static async setOrders (
    customerId: string,
    quantity: number,
    amount: number,
    status: string,
    payment: string,
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders | null> {
    if (customerId) {
      if (customerId.length !== 24) { return await Promise.reject('customerId inválid'); }

      if (!await ordersGateway.isValidId(customerId)) { return await Promise.reject('customerId inválid'); }
    }

    const entity = new Orders(
      '',
      0,
      customerId,
      quantity,
      amount,
      status,
      payment,
      null,
      null
    );

    if (!entity.statusCheck) return await Promise.reject('status inválid');
    if (!entity.paymentCheck) return await Promise.reject('payment inválid');
    if (!entity.statusWithPaymentCheck) { return await Promise.reject('payment which status inválid'); }

    try {
      const customers = await ordersGateway.persist(
        customerId,
        quantity,
        amount,
        status,
        payment
      );
      return new Orders(
        customers._id,
        customers.protocol,
        customers.customerId,
        customers.quantity,
        customers.amount,
        customers.status,
        customers.payment,
        customers.created_at,
        customers.updated_at
      );
    } catch (error) {
      return await Promise.reject((error instanceof Error ? error.message : 'failure insert'));
    }
  }

  static async updateOrders (
    id: string,
    customerId: string | null,
    quantity: number | 0,
    amount: number | 0,
    status: string,
    payment: string,
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders | null> {
    if (!status) return await Promise.reject('status inválid');

    if (['DENIED', 'CANCELED'].includes(payment)) {
      status = 'CANCELED';
      payment = 'CANCELED';
    }

    if (['CANCELED'].includes(status)) {
      status = 'CANCELED';
      payment = 'CANCELED';
    }

    const entity = new Orders(
      '',
      0,
      customerId,
      quantity,
      amount,
      status,
      payment,
      null,
      null
    );

    if (!entity.statusCheck) return await Promise.reject('status inválid');
    if (!entity.paymentCheck) return await Promise.reject('payment inválid');
    if (!entity.statusWithPaymentCheck) { return await Promise.reject('payment which status inválid'); }

    try {
      const customers = await ordersGateway.update(
        id,
        customerId,
        quantity,
        amount,
        status,
        payment
      );
      return new Orders(
        customers._id,
        customers.protocol,
        customers.customerId,
        customers.quantity,
        customers.amount,
        customers.status,
        customers.payment,
        customers.created_at,
        customers.updated_at
      );
    } catch (error) {
      return await Promise.reject('failure update');
    }
  }

  static async removeOrdersById (
    id: string,
    ordersGateway: OrdersGatewayInterface
  ): Promise<any | null> {
    try {
      await ordersGateway.remove(id);
      return await Promise.resolve('removed');
    } catch (error) {
      return await Promise.reject('id inexistent');
    }
  }
}

export { OrdersUseCases };
