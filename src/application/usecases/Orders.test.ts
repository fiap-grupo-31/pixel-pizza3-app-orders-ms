import { OrdersUseCases } from './Orders';
import { Orders } from '../../domain/entities/Orders';
import { PaymentApiAdapter } from '../../interfaces/adapters/PaymentApiAdapter';
import { ProductionApiAdapter } from '../../interfaces/adapters/ProductionApiAdapter';

const ordersGatewayMock = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  isValidId: jest.fn()
};

describe('OrdersUseCases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter todos as ordens de pedidos corretamente', async () => {
    const order = new Orders('1213213', 1, '1234567777', 1, 10, 'RECEIVE', 'APROVED', 'TESTE', new Date(), new Date());
    const expectedOrders: Orders[] = [order];
    ordersGatewayMock.findAll.mockResolvedValue(expectedOrders);

    const resultado = await OrdersUseCases.getOrdersAll(ordersGatewayMock);

    expect(resultado).toEqual(expectedOrders);
    expect(ordersGatewayMock.findAll).toHaveBeenCalledTimes(1);

    ordersGatewayMock.findAll.mockResolvedValueOnce([
    ]);
  });

  it('deve obter as ordens por parâmetro corretamente', async () => {
    const order = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', new Date(), new Date());
    const reference = { status: 'RECEIVE' };
    const expectedOrders: Orders[] = [order];
    ordersGatewayMock.find.mockResolvedValue(expectedOrders);

    const resultado = await OrdersUseCases.getOrdersByStatus(reference, ordersGatewayMock);

    expect(resultado).toEqual(expectedOrders);
    expect(ordersGatewayMock.find).toHaveBeenCalledWith(reference);
  });

  it('deve obter uma ordem por ID corretamente', async () => {
    const orderId = '65a6f49f11aa6ff459b050e9';
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.findId.mockResolvedValue(expectedOrder);

    const resultado = await OrdersUseCases.getOrdersById(orderId, ordersGatewayMock);

    expect(resultado).toEqual(expectedOrder);
    expect(ordersGatewayMock.findId).toHaveBeenCalledWith(orderId);
  });

  it('deve criar uma nova ordem corretamente', async () => {
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.persist.mockResolvedValue(expectedOrder);
    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const paymentApiAdapter = new PaymentApiAdapter('');
    const resultado = await OrdersUseCases.setOrders('65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', paymentApiAdapter, ordersGatewayMock);

    expect(resultado).toEqual(expectedOrder);
  });

  it('deve gerar erro ao enviar customerid com menos digitos em uma nova ordem', async () => {
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.persist.mockResolvedValue(expectedOrder);
    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const paymentApiAdapter = new PaymentApiAdapter('');

    try {
      await OrdersUseCases.setOrders('65a6f49f11aa6ff459b050e', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', paymentApiAdapter, ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('customerId inválid');
    }
  });

  it('deve gerar erro ao enviar customerid errado em uma nova ordem', async () => {
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '1a2d1r2e1r2e1r2e1r2e1re2', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.persist.mockResolvedValue(expectedOrder);
    ordersGatewayMock.isValidId.mockResolvedValue(false);

    const paymentApiAdapter = new PaymentApiAdapter('');

    try {
      await OrdersUseCases.setOrders('1a2d1r2e1r2e1r2e1r2e1re2', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', paymentApiAdapter, ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('customerId inválid');
    }
  });

  it('deve gerar erro ao enviar status de pagamento invalido em uma nova ordem', async () => {
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.persist.mockResolvedValue(expectedOrder);
    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const paymentApiAdapter = new PaymentApiAdapter('');

    try {
      await OrdersUseCases.setOrders('65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APROVED', 'TESTE', paymentApiAdapter, ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('payment inválid');
    }
  });

  it('deve gerar erro ao enviar status de pagamento e status invalido em uma nova ordem', async () => {
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e9', 1, 10, 'CANCELED', 'APPROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.persist.mockResolvedValue(expectedOrder);
    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const paymentApiAdapter = new PaymentApiAdapter('');

    try {
      await OrdersUseCases.setOrders('65a6f49f11aa6ff459b050e9', 1, 10, 'CANCELED', 'APPROVED', 'TESTE', paymentApiAdapter, ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('payment which status inválid');
    }
  });

  it('deve gerar erro ao criar uma nova ordem', async () => {
    ordersGatewayMock.persist.mockResolvedValue(Promise.reject(new Error('failure insert')));
    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const paymentApiAdapter = new PaymentApiAdapter('');

    try {
      await OrdersUseCases.setOrders('65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', paymentApiAdapter, ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('failure insert');
    }
  });

  it('deve atualizar uma ordem por id', async () => {
    const expectedOrder = new Orders('65a6f49f11aa6ff459b050e9', 1, '65a6f49f11aa6ff459b050e9', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', new Date(), new Date());
    ordersGatewayMock.update.mockResolvedValue(expectedOrder);
    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const productionApiAdapter = new ProductionApiAdapter('');
    const resultado = await OrdersUseCases.updateOrders('65a6f49f11aa6ff459b050e9', '65a6f49f11aa6ff459b050e9', '1', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', productionApiAdapter, ordersGatewayMock);

    expect(resultado).toEqual(expectedOrder);
  });

  it('deve gerar falha ao atualizar uma ordem por id', async () => {
    ordersGatewayMock.update.mockResolvedValue(Promise.reject(new Error('failure update')));

    ordersGatewayMock.isValidId.mockResolvedValue(true);

    const productionApiAdapter = new ProductionApiAdapter('');

    try {
      await OrdersUseCases.updateOrders('65a6f49f11aa6ff459b050e9', '65a6f49f11aa6ff459b050e9', '1', 1, 10, 'RECEIVE', 'APPROVED', 'TESTE', productionApiAdapter, ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('failure update');
    }
  });

  it('deve retornar sucesso ao remover uma ordem por id', async () => {
    ordersGatewayMock.remove.mockResolvedValue(Promise.resolve('removed'));

    const resultado = await OrdersUseCases.removeOrdersById('65a6f49f11aa6ff459b050e9', ordersGatewayMock);
    expect(resultado).toEqual('removed');
  });

  it('deve retornar falha ao remover uma ordem por id', async () => {
    ordersGatewayMock.remove.mockResolvedValue(Promise.reject(new Error('id inexistent')));

    try {
      await OrdersUseCases.removeOrdersById('65a6f49f11aa6ff459b050e9', ordersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('id inexistent');
    }
  });
});
