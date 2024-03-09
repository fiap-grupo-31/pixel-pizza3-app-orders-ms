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
    orderDescription: string,
    _rabbitMqService: any,
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders | null> {
    if (customerId) {
      if (customerId.length !== 24) {
        throw new Error('customerId inválid');
      }

      if (!await ordersGateway.isValidId(customerId)) {
        throw new Error('customerId inválid');
      }
    }

    const entity = new Orders(
      '',
      0,
      customerId,
      quantity,
      amount,
      status,
      payment,
      '',
      '',
      orderDescription,
      null,
      null
    );

    if (!entity.statusCheck) {
      throw new Error('status inválid');
    }
    if (!entity.paymentCheck) {
      throw new Error('payment inválid');
    }
    if (!entity.statusWithPaymentCheck) {
      throw new Error('payment which status inválid');
    }

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
        order.paymentReference ?? '',
        order.productionReference ?? '',
        order?.orderDescription,
        order.created_at,
        order.updated_at
      );

      try {
        await _rabbitMqService.sendMessage('payments', {
          event: 'createPayment',
          orderId: order._id ?? '',
          mode: 'fake',
          quantity: order.quantity,
          amount: order.amount
        })

        await _rabbitMqService.sendMessage('orders', {
          event: 'sendNotify',
          customerId: order.customerId,
          message: 'Pedido realizado: *Aguardando pagamento*'
        })
      } catch (error) {
      }

      return orders;
    } catch (error) {
      throw new Error((error instanceof Error ? error.message : 'failure insert'));
    }
  }

  static async updateOrders (
    id: string,
    customerId: string,
    protocol: string,
    quantity: number,
    amount: number,
    status: string,
    payment: string,
    paymentReference: string,
    productionReference: string,
    orderDescription: string,
    _rabbitMqService: any,
    ordersGateway: OrdersGatewayInterface
  ): Promise<Orders | null> {
    if (['DENIED', 'CANCELED'].includes(payment)) {
      status = (status === 'FAIL' ? status : 'CANCELED');
      payment = 'CANCELED';
    }

    if (['CANCELED'].includes(status)) {
      status = 'CANCELED';
      payment = 'CANCELED';
    }

    if (['FAIL'].includes(status)) {
      status = 'FAIL';
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
      paymentReference,
      productionReference,
      orderDescription,
      null,
      null
    );

    if (!entity.statusCheck) {
      throw new Error('status inválid');
    }
    if (!entity.paymentCheck) {
      throw new Error('payment inválid');
    }
    if (!entity.statusWithPaymentCheck) {
      throw new Error('payment which status inválid');
    }

    try {
      const order = await ordersGateway.update(
        id,
        customerId,
        quantity,
        amount,
        status,
        payment,
        paymentReference,
        productionReference,
        orderDescription
      );

      try {
        if (status === 'RECEIVE' && payment === 'APPROVED' && ((productionReference ?? '') === '')) {
          await _rabbitMqService.sendMessage('orders', {
            event: 'sendNotify',
            customerId: order.customerId,
            message: `Pedido ${protocol}: Pagamento aprovado`
          })

          // ENVIA PARA PRODUÇÃO APOS PAGAMENTO APROVADO
          await _rabbitMqService.sendMessage('productions', {
            event: 'createProduction',
            id,
            protocol,
            orderDescription,
            status: 'WAITING'
          })
        } else if (status === 'FAIL') {
          await _rabbitMqService.sendMessage('orders', {
            event: 'sendNotify',
            customerId: order.customerId,
            message: `Pedido ${protocol}: ` + (payment === 'DENIED' ? 'Pagamento rejeitado' : 'Houve uma falha')
          })

          await _rabbitMqService.sendMessage('payments', {
            event: 'rejectPayment',
            orderId: id,
            status: 'CANCELED'
          })
        }

        if (payment === 'DENIED' || payment === 'CANCELED') {
          await _rabbitMqService.sendMessage('orders', {
            event: 'sendNotify',
            customerId: order.customerId,
            message: `Pedido ${protocol}: Pagamento rejeitado`
          })
        }

        if (status === 'IN_PROGRESS') {
          await _rabbitMqService.sendMessage('orders', {
            event: 'sendNotify',
            customerId: order.customerId,
            message: `Pedido ${protocol}: Em preparação`
          })
        }
        if (status === 'FINISH') {
          await _rabbitMqService.sendMessage('orders', {
            event: 'sendNotify',
            customerId: order.customerId,
            message: `Pedido ${protocol}: Pedido pronto, favor retirar`
          })
        }
        if (status === 'DONE') {
          await _rabbitMqService.sendMessage('orders', {
            event: 'sendNotify',
            customerId: order.customerId,
            message: `Pedido ${protocol}: Pedido entregue`
          })
        }
      } catch (error) {

      }

      return new Orders(
        order._id,
        order.protocol,
        order.customerId,
        order.quantity,
        order.amount,
        order.status,
        order.payment,
        order.paymentReference ?? '',
        order.productionReference ?? '',
        order?.orderDescription,
        order.created_at,
        order.updated_at
      );
    } catch (error) {
      throw new Error('failure update');
    }
  }

  static async removeOrdersById (
    id: string,
    ordersGateway: OrdersGatewayInterface
  ): Promise<any> {
    try {
      await ordersGateway.remove(id);
      return await Promise.resolve('removed');
    } catch (error) {
      throw new Error((error instanceof Error ? error.message : 'id inexistent'));
    }
  }
}

export { OrdersUseCases };
