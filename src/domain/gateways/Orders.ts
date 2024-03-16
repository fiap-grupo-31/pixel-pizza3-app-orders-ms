import { Orders } from '../entities';
import { type DbConnection } from '../interfaces/dbconnection';
import { type OrdersGatewayInterface } from '../interfaces/OrdersGatewayInterface';

export class OrdersGateway implements OrdersGatewayInterface {
  private readonly repositorioDados: DbConnection;
  private readonly schema = 'orders';

  constructor (database: DbConnection) {
    this.repositorioDados = database;
  }

  async findId (id: string): Promise<Orders | null> {
    const result = await this.repositorioDados.findId(this.schema, id);

    if (result === null) {
      return null;
    } else {
      return new Orders(
        result.id,
        result.protocol,
        result.customerId,
        result.quantity,
        result.amount,
        result.status,
        result.payment,
        result.paymentReference,
        result.productionReference,
        result?.orderDescription,
        result.created_at,
        result.updated_at
      );
    }
  }

  async find (reference: Record<string, any>): Promise<Orders[] | null> {
    const result = await this.repositorioDados.find(this.schema, reference);

    if (result === null) {
      return null;
    } else {
      const returnData: Orders[] = [];
      result.forEach((element: any) => {
        returnData.push(
          new Orders(
            element.id,
            element.protocol,
            element.customerId,
            element.quantity,
            element.amount,
            element.status,
            element.payment,
            element.paymentReference,
            element.productionReference,
            element?.orderDescription,
            element.created_at,
            element.updated_at
          )
        );
      });
      return returnData;
    }
  }

  async findAll (): Promise<Orders[] | null> {
    const result = await this.repositorioDados.findAll(this.schema);

    if (result === null) {
      return null;
    } else {
      const returnData: Orders[] = [];
      result.forEach((element: any) => {
        returnData.push(
          new Orders(
            element.id,
            element.protocol,
            element.customerId,
            element.quantity,
            element.amount,
            element.status,
            element.payment,
            element.paymentReference,
            element.productionReference,
            element?.orderDescription,
            element.created_at,
            element.updated_at
          )
        );
      });
      return returnData;
    }
  }

  async persist (
    customerId: any,
    quantity: number,
    amount: number,
    status: string,
    payment: string,
    orderDescription: string
  ): Promise<any> {
    const orders = new Orders(
      '',
      0,
      customerId,
      amount,
      quantity,
      status,
      payment,
      '',
      '',
      orderDescription,
      null,
      null
    )

    const objectPersist: any = {
      status: orders.status,
      payment: orders.payment,
      paymentReference: '',
      productionReference: '',
      quantity: orders.quantity,
      amount: orders.amount,
      orderDescription: orders.orderDescription
    }

    if (orders.customerId !== '') { objectPersist.customerId = orders.customerId; }

    const success = await this.repositorioDados.persist(
      this.schema,
      objectPersist
    );

    return success;
  }

  async update (
    id: string,
    customerId: any,
    quantity: number,
    amount: number,
    status: string,
    payment: string,
    paymentReference: string,
    productionReference: string,
    orderDescription: string
  ): Promise<any> {
    const orders = new Orders(
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
    )

    const objectPersist: any = {
      status: orders.status,
      payment: orders.payment,
      paymentReference,
      productionReference
    }

    if (orders.customerId !== '') { objectPersist.customerId = orders.customerId; }

    const success = await this.repositorioDados.update(
      this.schema,
      id,
      objectPersist
    );

    return success;
  }

  async remove (id: string): Promise<any> {
    const result = await this.repositorioDados.remove(this.schema, id);

    return result;
  }

  async isValidId (id: string): Promise<boolean> {
    const result = await this.repositorioDados.isValidId(id);

    return result;
  }
}
