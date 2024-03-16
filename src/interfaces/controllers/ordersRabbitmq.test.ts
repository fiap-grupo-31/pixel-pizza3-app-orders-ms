import { OrdersRabbitmqController } from './ordersRabbitmq';
import { OrdersUseCases, OrdersItensUseCases, ProductsUseCases, CustomersUseCases } from '../../application/usecases';
import { Orders } from '../../domain/entities/Orders';
import { OrdersController } from './orders';
import { CustomersController } from './customers';
import { WhatsappApiAdapter } from '../../interfaces/adapters/WhatsappApiAdapter';

jest.mock('./orders');
jest.mock('./customers');
jest.mock('../../interfaces/adapters/WhatsappApiAdapter');

describe('OrdersRabbitmqController', () => {
  describe('startConsuming', () => {
    it('should consume orders and call corresponding event function', async () => {
      const mockDbConnection = {} as any;
      const mockRabbitMqService = {
        consume: jest.fn((topic: string, callback: Function) => {
          callback({ event: 'aceptedOrder', orderId: 'orderId', status: 'status' });
        }),
      };

      await OrdersRabbitmqController.startConsuming(mockDbConnection, mockRabbitMqService);

      expect(mockRabbitMqService.consume).toHaveBeenCalledWith('orders', expect.any(Function));
      expect(OrdersRabbitmqController.aceptedOrder).toHaveBeenCalledWith(
        { event: 'aceptedOrder', orderId: 'orderId', status: 'status' },
        mockDbConnection,
        mockRabbitMqService
      );
    });

    it('should handle error if consume throws', async () => {
      const mockDbConnection = {} as any;
      const mockRabbitMqService = {
        consume: jest.fn().mockRejectedValue(new Error('consume error')),
      };

      await expect(OrdersRabbitmqController.startConsuming(mockDbConnection, mockRabbitMqService)).rejects.toThrow('consume error');
    });
  });

  describe('rejectOrder', () => {
    it('should update order with FAIL and CANCELED status', async () => {
      const mockData = {
        orderId: 'orderId',
        paymentReference: 'paymentReference',
        productionReference: 'productionReference'
      };
      const mockDbConnection = {} as any;
      const mockRabbitMqService = {} as any;
      
      await OrdersRabbitmqController.rejectOrder(mockData, mockDbConnection, mockRabbitMqService);

      expect(OrdersController.updateOrder).toHaveBeenCalledWith(
        'orderId',
        '',
        'FAIL',
        'CANCELED',
        'paymentReference',
        'productionReference',
        mockRabbitMqService,
        mockDbConnection
      );
    });
  });

  // Adicione testes para os outros métodos (aceptedOrder, statusOrder, sendNotify) de maneira semelhante
});
