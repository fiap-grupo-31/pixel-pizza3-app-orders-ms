import { OrdersController } from './orders';
import { OrdersUseCases, OrdersItensUseCases, ProductsUseCases, CustomersUseCases } from '../../application/usecases';
import { OrdersGateway, ProductsGateway, CustomersGateway } from '../../domain/gateways';
import { Global, OrdersAdapter } from '../adapters';
import { Orders } from '../../domain/entities/Orders';
import { OrdersItens } from '../../domain/entities/OrdersItens';
import { Products } from '../../domain/entities/Products';
import { Customers } from '../../domain/entities/Customers';

describe('OrdersController', () => {
  let dbConnectionMock: any;

  beforeEach(() => {
    dbConnectionMock = {
      findId: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      removeFind: jest.fn(),
      findAll: jest.fn(),
      persist: jest.fn(),
      update: jest.fn(),
      isValidId: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('deve retornar lista de ordens', async () => {
      const expectedOrders = [new Orders('1213', 1, '1223', 0, 1, 'RECEIVE', 'APPROVED', 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];
      jest.spyOn(OrdersUseCases, 'getOrdersAll').mockResolvedValueOnce(expectedOrders);

      const result = await OrdersController.getOrders(dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":"1213","_protocol":1,"_customerId":"1223","_quantity":0,"_amount":1,"_status":"RECEIVE","_payment":"APPROVED","_orderDescription":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z"}]}');
    });

    it('deve retornar falha na listade ordens', async () => {
      jest.spyOn(OrdersUseCases, 'getOrdersAll').mockRejectedValueOnce('error');

      try {
        await OrdersController.getOrders(dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe('');
      }
    });

    it('deve retornar lista de ordens ordenadas', async () => {
      const expectedOrders = [new Orders('1213', 1, '1223', 0, 1, 'RECEIVE', 'APPROVED', 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];
      const expectedOrdersItens = [new OrdersItens('1213', '000', '12313', 1, 10, 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];

      jest.spyOn(OrdersUseCases, 'getOrdersByStatus').mockResolvedValueOnce(expectedOrders);
      jest.spyOn(OrdersItensUseCases, 'getOrdersItensByOrderId').mockResolvedValueOnce(expectedOrdersItens);

      const result = await OrdersController.getOrdersByOpen('RECEIVE', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":"1213","_protocol":1,"_customerId":"1223","_quantity":0,"_amount":1,"_status":"RECEIVE","_payment":"APPROVED","_orderDescription":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z","_itens":[{"_id":"1213","_orderId":"000","_productId":"12313","_price":1,"_quantity":10,"_obs":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z","_product":{}}],"_sort":3}]}');
    });

    it('deve retornar falha na listade ordens ordenadas', async () => {
      jest.spyOn(OrdersUseCases, 'getOrdersByStatus').mockRejectedValueOnce('error');

      try {
        await OrdersController.getOrdersByOpen('WAITING', dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe('');
      }
    });

    it('deve retornar lista de ordens por status', async () => {
      const expectedOrders = [new Orders('1213', 1, '1223', 0, 1, 'RECEIVE', 'APPROVED', 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];
      const expectedOrdersItens = [new OrdersItens('1213', '000', '12313', 1, 10, 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];

      jest.spyOn(OrdersUseCases, 'getOrdersByStatus').mockResolvedValueOnce(expectedOrders);
      jest.spyOn(OrdersItensUseCases, 'getOrdersItensByOrderId').mockResolvedValueOnce(expectedOrdersItens);

      const result = await OrdersController.getOrdersByStatus('RECEIVE', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":"1213","_protocol":1,"_customerId":"1223","_quantity":0,"_amount":1,"_status":"RECEIVE","_payment":"APPROVED","_orderDescription":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z","_itens":[{"_id":"1213","_orderId":"000","_productId":"12313","_price":1,"_quantity":10,"_obs":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z"}]}]}');
    });

    it('deve retornar falha na listade ordens por status', async () => {
      jest.spyOn(OrdersUseCases, 'getOrdersByStatus').mockRejectedValueOnce('error');

      try {
        await OrdersController.getOrdersByStatus('WAITING', dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe('');
      }
    });

    it('deve retornar lista de ordens por id', async () => {
      const expectedOrders = new Orders('1213', 1, '1223', 0, 1, 'RECEIVE', 'APPROVED', 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'));
      const expectedOrdersItens = [new OrdersItens('1213', '000', '12313', 1, 10, 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];

      jest.spyOn(OrdersUseCases, 'getOrdersById').mockResolvedValueOnce(expectedOrders);
      jest.spyOn(OrdersItensUseCases, 'getOrdersItensByOrderId').mockResolvedValueOnce(expectedOrdersItens);

      const result = await OrdersController.getOrdersById('123', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"1213","_protocol":1,"_customerId":"1223","_quantity":0,"_amount":1,"_status":"RECEIVE","_payment":"APPROVED","_orderDescription":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z","_itens":[{"_id":"1213","_orderId":"000","_productId":"12313","_price":1,"_quantity":10,"_obs":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z","_product":{}}]}}');
    });

    it('deve retornar falha na listade ordens por status', async () => {
      jest.spyOn(OrdersUseCases, 'getOrdersById').mockRejectedValueOnce('error');
      jest.spyOn(OrdersItensUseCases, 'getOrdersItensByOrderId').mockRejectedValueOnce('error');

      try {
        await OrdersController.getOrdersById('123', dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe(undefined);
      }
    });

    it('deve retornar informação caso sucesso na criação de um pedido', async () => {
      const expectedCustomer = new Customers('65b2ab1f58f91766c90d592d', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
      const expectedProduct = new Products('65b2ab1f58f91766c90d592d', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      const expectedOrders = new Orders('65b2ab1f58f91766c90d592d', 1, '65b2ab1f58f91766c90d592d', 1, 1, 'RECEIVE', 'APPROVED', 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'));
      const expectedOrdersItens = [new OrdersItens('1213', '000', '12313', 1, 10, 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'))];

      jest.spyOn(CustomersUseCases, 'getCustomersById').mockResolvedValueOnce(expectedCustomer);
      jest.spyOn(ProductsUseCases, 'getProductsById').mockResolvedValueOnce(expectedProduct);
      jest.spyOn(OrdersUseCases, 'setOrders').mockResolvedValueOnce(expectedOrders);
      jest.spyOn(OrdersItensUseCases, 'getOrdersItensByOrderId').mockResolvedValueOnce(expectedOrdersItens);

      const result = await OrdersController.setOrder('65b2ab1f58f91766c90d592d', expectedOrdersItens, dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"65b2ab1f58f91766c90d592d","_protocol":1,"_customerId":"65b2ab1f58f91766c90d592d","_quantity":1,"_amount":1,"_status":"RECEIVE","_payment":"APPROVED","_orderDescription":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z","_itens":[]}}');
    });

    it('deve retornar falha informação caso sucesso na criação de um pedido', async () => {
      jest.spyOn(OrdersUseCases, 'setOrders').mockRejectedValueOnce('error');

      try {
        await OrdersController.setOrder('123', [], dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe(undefined);
      }
    });

    it('deve remover a ordens por id', async () => {
      jest.spyOn(OrdersUseCases, 'removeOrdersById').mockResolvedValueOnce('');

      const result = await OrdersController.removeOrdersById('123', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":""}');
    });

    it('deve retornar falha ao tentar remover a ordens por id', async () => {
      jest.spyOn(OrdersUseCases, 'removeOrdersById').mockRejectedValueOnce('error');
      jest.spyOn(OrdersItensUseCases, 'removeOrdersItensByOrderId').mockRejectedValueOnce('error');

      try {
        await OrdersController.removeOrdersById('123', dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe(undefined);
      }
    });

    it('deve atualizar um pedido por id', async () => {
      const expectedOrders = new Orders('65b2ab1f58f91766c90d592d', 1, '65b2ab1f58f91766c90d592d', 1, 1, 'RECEIVE', 'APPROVED', 'TESTE', new Date('2023-01-01'), new Date('2023-01-01'));

      jest.spyOn(OrdersUseCases, 'getOrdersById').mockResolvedValueOnce(expectedOrders);
      jest.spyOn(OrdersUseCases, 'updateOrders').mockResolvedValueOnce(expectedOrders);

      const result = await OrdersController.updateOrder('65b2ab1f58f91766c90d592d', '65b2ab1f58f91766c90d592d', 'RECEIVE', 'APPROVED', dbConnectionMock);
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"65b2ab1f58f91766c90d592d","_protocol":1,"_customerId":"65b2ab1f58f91766c90d592d","_quantity":1,"_amount":1,"_status":"RECEIVE","_payment":"APPROVED","_orderDescription":"TESTE","_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z"}}');
    });

    it('deve retornar falha ao atualizar um pedido por id', async () => {
      jest.spyOn(OrdersUseCases, 'getOrdersById').mockRejectedValueOnce('error');
      jest.spyOn(OrdersUseCases, 'updateOrders').mockRejectedValueOnce('error');

      try {
        await OrdersController.updateOrder('65b2ab1f58f91766c90d592d', '65b2ab1f58f91766c90d592d', 'RECEIVE', 'APPROVED', dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toBe(undefined);
      }
    });
  });
})
