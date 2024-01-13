/* eslint-disable prefer-promise-reject-errors */
import { Orders } from '../../domain/entities/Orders';
import { type OrdersGatewayInterface } from '../../domain/interfaces/OrdersGatewayInterface';
import { type PaymentApiAdapter } from '../../interfaces/adapters/PaymentApiAdapter';
import { type ProductionApiAdapter } from '../../interfaces/adapters/ProductionApiAdapter';

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
    orderDescription: string,
    paymentApiAdapter: PaymentApiAdapter,
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
      orderDescription,
      null,
      null
    );

    if (!entity.statusCheck) return await Promise.reject('status inválid');
    if (!entity.paymentCheck) return await Promise.reject('payment inválid');
    if (!entity.statusWithPaymentCheck) { return await Promise.reject('payment which status inválid'); }

    try {
      const order = await ordersGateway.persist(
        customerId,
        quantity,
        amount,
        status,
        payment,
        orderDescription
      );
      const orders = new Orders(
        order._id,
        order.protocol,
        order.customerId,
        order.quantity,
        order.amount,
        order.status,
        order.payment,
        order?.orderDescription,
        order.created_at,
        order.updated_at
      );

      await paymentApiAdapter.createPayment(
        order._id ?? '',
        'fake',
        order.quantity,
        order.amount
      )

      return orders;
    } catch (error) {
      return await Promise.reject((error instanceof Error ? error.message : 'failure insert'));
    }
  }

  static async updateOrders (
    id: string,
    customerId: string | null,
    protocol: string,
    quantity: number | 0,
    amount: number | 0,
    status: string,
    payment: string,
    orderDescription: string,
    productionApiAdapter: ProductionApiAdapter,
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
      orderDescription,
      null,
      null
    );

    if (!entity.statusCheck) return await Promise.reject('status inválid');
    if (!entity.paymentCheck) return await Promise.reject('payment inválid');
    if (!entity.statusWithPaymentCheck) { return await Promise.reject('payment which status inválid'); }

    try {
      const order = await ordersGateway.update(
        id,
        customerId,
        quantity,
        amount,
        status,
        payment,
        orderDescription
      );

      if (status === 'RECEIVE' && payment === 'APPROVED') {
        await productionApiAdapter.createProduction(
          id,
          protocol,
          orderDescription
        )
      }

      return new Orders(
        order._id,
        order.protocol,
        order.customerId,
        order.quantity,
        order.amount,
        order.status,
        order.payment,
        order?.orderDescription,
        order.created_at,
        order.updated_at
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
