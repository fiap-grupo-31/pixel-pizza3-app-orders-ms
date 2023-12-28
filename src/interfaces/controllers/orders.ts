import {
  OrdersGateway,
  OrdersItemsGateway,
  CustomersGateway,
  ProductsGateway
} from '../../domain/gateways';

import { PaymentApiAdapter } from '../adapters/PaymentApiAdapter'
import { ProductionApiAdapter } from '../adapters/ProductionApiAdapter'
import { type DbConnection } from '../../domain/interfaces/dbconnection';
import {
  OrdersUseCases,
  OrdersItensUseCases,
  CustomersUseCases,
  ProductsUseCases
} from '../../application/usecases';
import { Global, OrdersAdapter } from '../adapters';

/**
 * Pedidos
 *
 * @export
 * @class OrdersController
 */
export class OrdersController {
  /**
   * Retona lista de pedidos
   *
   * @static
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async getOrders (dbconnection: DbConnection): Promise<string> {
    const ordersGateway = new OrdersGateway(dbconnection);
    const allOrders = await OrdersUseCases.getOrdersAll(ordersGateway)
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(allOrders);
    return adapted;
  }

  /**
   * Retorna pedido em aberto (recebido pago - em produção - pronto)
   *
   * @static
   * @param {string} reference
   * @param {(any | '')} column
   * @param {(any | '')} sort
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async getOrdersByOpen (
    reference: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const ordersSort: any = {
      DONE: 1,
      IN_PROGRESS: 2,
      RECEIVE: 3
    };

    const allOrders = await OrdersUseCases.getOrdersByStatus(
      {
        status: {
          $in: [
            'DONE', // PRONTO
            'IN_PROGRESS', // PREPARANDO
            'RECEIVE' // RECEBIDO NO SISTEMA
          ]
        }
      },
      new OrdersGateway(dbconnection)
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return Global.error(err);
      });

    let orderConvert = Global.convertToObject(allOrders);

    if (!orderConvert.length) {
      return JSON.stringify(Global.success(allOrders));
    }

    for (const order of orderConvert) {
      const reference: Record<string, any> = {
        orderId: order._id
      };

      const orderItem = await OrdersItensUseCases.getOrdersItensByOrderId(
        reference,
        new OrdersItemsGateway(dbconnection)
      );

      const orderItemConvert = Global.convertToObject(orderItem);
      for (const product of orderItemConvert) {
        const products = await ProductsUseCases.getProductsById(
          product?._productId,
          new ProductsGateway(dbconnection)
        )
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return err;
          });

        product._product = products;
      }
      order._itens = orderItemConvert;

      order._sort = ordersSort[order._status] || 999;
    }

    orderConvert = await OrdersAdapter.adaptSortOrdersOpen(
      orderConvert,
      '_sort',
      '_created_at'
    );

    return JSON.stringify(Global.success(orderConvert));
  }

  /**
   * Retorna pedidos por status
   *
   * @static
   * @param {string} reference
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async getOrdersByStatus (
    reference: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const productsImagesGateway = new OrdersGateway(dbconnection);
    const allOrders = await OrdersUseCases.getOrdersByStatus(
      {
        status: reference
      },
      productsImagesGateway
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return Global.error(err);
      });

    const orderConvert = Global.convertToObject(allOrders);

    if (!orderConvert.length) {
      return JSON.stringify(Global.success(allOrders));
    }

    for (const order of orderConvert) {
      const reference: Record<string, any> = {
        orderId: order._id
      };

      const ordersItensGateway = new OrdersItemsGateway(dbconnection);
      const orderItem = await OrdersItensUseCases.getOrdersItensByOrderId(
        reference,
        ordersItensGateway
      );

      order._itens = orderItem;
    }

    return JSON.stringify(Global.success(orderConvert));
  }

  /**
   * Retorna pedido por id
   *
   * @static
   * @param {string} id
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async getOrdersById (
    id: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const ordersGateway = new OrdersGateway(dbconnection);
    const order = await OrdersUseCases.getOrdersById(id, ordersGateway)
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const reference: Record<string, any> = {
      orderId: id
    };

    const ordersItensGateway = new OrdersItemsGateway(dbconnection);
    const orderItem = await OrdersItensUseCases.getOrdersItensByOrderId(
      reference,
      ordersItensGateway
    );

    const orderConvert = Global.convertToObject(order);
    orderConvert.data._itens = orderItem;

    for (const product of orderConvert.data._itens) {
      const products = await ProductsUseCases.getProductsById(
        product?._productId,
        new ProductsGateway(dbconnection)
      )
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err;
        });

      product._product = products;
    }

    const adapted = JSON.stringify(orderConvert);
    return adapted;
  }

  /**
   * Registra um pedido
   *
   * @static
   * @param {string} customerId
   * @param {Array<any>} orderItens
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async setOrder (
    customerId: string,
    orderItens: any[],
    dbconnection: DbConnection
  ): Promise<string> {
    const ordersGateway = new OrdersGateway(dbconnection);
    const status = 'RECEIVE';
    const payment = 'NONE';

    if (!orderItens?.length) {
      return JSON.stringify(Global.error('orderItens invalid'));
    }

    let amountTotal: number = 0;
    let quantityTotal: number = 0;
    const productsList: any = {};
    const orderDescription: any = [
      'Pedido: xxxxx',
      ''
    ];
    // valida se produto existe e se quantidade foi preenchida
    for (const item of orderItens) {
      if (!item?.productId) {
        return JSON.stringify(Global.error('productId invalid'));
      }
      if (!(item?.quantity || 0)) {
        return JSON.stringify(Global.error('quantity invalid'));
      }

      const productsGateway = new ProductsGateway(dbconnection);
      const products = await ProductsUseCases.getProductsById(
        item?.productId,
        productsGateway
      )
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err;
        });

      if (!products?._id) {
        return JSON.stringify(
          Global.error(`productId inexistent: ${item?.productId}`)
        );
      }

      orderDescription.push(`${item.quantity}x R$ ${products?._price}: ${products?._name}  R$ ${parseInt(item.quantity) * parseFloat(products?._price)}`)

      productsList[item?.productId] = products;

      amountTotal += Number(products?._price);
      quantityTotal += Number(item?.quantity);
    }
    orderDescription.push('')
    orderDescription.push(`${quantityTotal} itens: Total  R$ ${amountTotal}`)

    // valida se existe customerId preenchido (vinculo a um cliente), caso não passa sem cliente definido
    if (customerId?.length) {
      if (customerId?.length !== 24) {
        return JSON.stringify(Global.error('customerId invalid'));
      }

      const customersGateway = new CustomersGateway(dbconnection);
      const customerGet = await CustomersUseCases.getCustomersById(
        customerId,
        customersGateway
      )
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err;
        });

      if (!customerGet?._id) {
        return JSON.stringify(Global.error('customer inexistent'));
      }
    }

    const paymentApiAdapter = new PaymentApiAdapter(process.env.API_PAYMENT_BASEURL ?? '');
    // cria um pedido
    const order = await OrdersUseCases.setOrders(
      customerId,
      quantityTotal,
      amountTotal,
      status,
      payment,
      orderDescription.join('\n'),
      paymentApiAdapter,
      ordersGateway
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return Global.error(err);
      });

    const orderComplete = Global.convertToObject(order);

    if (!orderComplete?._id) return JSON.stringify(order);

    // insere os itens no pedido
    const ordersItensGateway = new OrdersItemsGateway(dbconnection);

    const orderItensList: any[] = [];
    for (const item of orderItens) {
      await OrdersItensUseCases.setOrdersItens(
        orderComplete?._id,
        item?.productId,
        0,
        item?.quantity,
        item?.obs,
        ordersItensGateway
      )
        .then((data) => {
          orderItensList.push(Global.convertToObject(data));
          return true;
        })
        .catch(() => {
          return false;
        });
    }

    for (const product of orderItensList) {
      product._product = productsList[product?._productId] ?? {}
    }

    orderComplete._itens = orderItensList;
    const adapted = JSON.stringify(Global.success(orderComplete));
    return adapted;
  }

  /**
   * Atualiza os parametros de um pedido
   *
   * @static
   * @param {string} id
   * @param {(string | null)} customer
   * @param {string} status
   * @param {(string | null)} payment
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async updateOrder (
    id: string,
    customer: string | null,
    status: string,
    payment: string | null,
    dbconnection: DbConnection
  ): Promise<string> {
    const ordersGateway = new OrdersGateway(dbconnection);

    const orderGet = await OrdersUseCases.getOrdersById(id, ordersGateway)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });

    const productionApiAdapter = new ProductionApiAdapter(process.env.API_PRODUCTION_BASEURL ?? '');

    const order = await OrdersUseCases.updateOrders(
      id,
      customer,
      orderGet?._protocol,
      orderGet?._quantity,
      orderGet?._amount,
      status,
      payment ?? orderGet?._payment,
      orderGet?._orderDescription,
      productionApiAdapter,
      ordersGateway
    )
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(order);
    return adapted;
  }

  /**
   * Atualiza o status de pagamento de um pedido
   *
   * @static
   * @param {string} id
   * @param {string} payment
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async updatePaymentOrder (
    id: string,
    payment: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const ordersGateway = new OrdersGateway(dbconnection);

    const orderGet = await OrdersUseCases.getOrdersById(id, ordersGateway)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });

    const productionApiAdapter = new ProductionApiAdapter(process.env.API_PRODUCTION_BASEURL ?? '');

    const order = await OrdersUseCases.updateOrders(
      id,
      orderGet?._customerId,
      orderGet?._protocol,
      orderGet?._quantity,
      orderGet?._amount,
      orderGet?._status,
      payment,
      orderGet?._orderDescription,
      productionApiAdapter,
      ordersGateway
    )
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(order);
    return adapted;
  }

  /**
   * Remove um pedido por id
   *
   * @static
   * @param {string} id
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof OrdersController
   */
  static async removeOrdersById (
    id: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const ordersItensGateway = new OrdersItemsGateway(dbconnection);

    await OrdersItensUseCases.removeOrdersItensByOrderId(
      id,
      ordersItensGateway
    )
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const ordersGateway = new OrdersGateway(dbconnection);
    const order = await OrdersUseCases.removeOrdersById(id, ordersGateway)
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(order);
    return adapted;
  }
}
