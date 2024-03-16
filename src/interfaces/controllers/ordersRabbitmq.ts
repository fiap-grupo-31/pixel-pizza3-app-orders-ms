/* eslint-disable @typescript-eslint/no-this-alias */
import { OrdersController } from './orders';
import { CustomersController } from './customers';
import { type DbConnection } from '../../domain/interfaces/dbconnection';
import { WhatsappApiAdapter } from '../../interfaces/adapters/WhatsappApiAdapter';

export class OrdersRabbitmqController {
  static async startConsuming (_dbconnection: DbConnection, _rabbitMqService: any): Promise<void> {
    try {
      _rabbitMqService.consume('orders', (message: any) => {
        const fn: any = this
        if (typeof fn[message.event] !== 'undefined') {
          fn[message.event](message, _dbconnection, _rabbitMqService);
        }
      });
    } catch (error) {
    }
  }

  static async rejectOrder (data: any, _dbconnection: DbConnection, _rabbitMqService: any): Promise<any> {
    const orders = await OrdersController.updateOrder(
      data?.orderId,
      '',
      'FAIL',
      'CANCELED',
      data?.paymentReference ?? '',
      data?.productionReference ?? '',
      _rabbitMqService,
      _dbconnection
    )
    console.log(orders)
  }

  static async aceptedOrder (data: any, _dbconnection: DbConnection, _rabbitMqService: any): Promise<any> {
    const orders = await OrdersController.updateOrder(
      data?.orderId,
      '',
      'RECEIVE',
      data?.status,
      data?.paymentReference,
      data?.productionReference ?? '',
      _rabbitMqService,
      _dbconnection
    )
    console.log(orders)
  }

  static async statusOrder (data: any, _dbconnection: DbConnection, _rabbitMqService: any): Promise<any> {
    console.log(data)
    const orders = await OrdersController.updateOrder(
      data?.orderId,
      '',
      data?.status,
      null,
      null,
      null,
      _rabbitMqService,
      _dbconnection
    )
    console.log(orders)
  }

  static async sendNotify (data: any, _dbconnection: DbConnection, _rabbitMqService: any): Promise<any> {
    console.log(data)

    const customer = await CustomersController.getCustomersById(
      data?.customerId,
      _dbconnection
    )

    const numberPhone = JSON.parse(customer)?.data?._phone ?? ''

    if (numberPhone?.length && data?.message?.length) {
      const whatsappApiAdapter = new WhatsappApiAdapter();
      await whatsappApiAdapter.sendMessage(numberPhone, data?.message);
    }
  }
}
