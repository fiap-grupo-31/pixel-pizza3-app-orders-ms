import { OrdersGateway } from './Orders';
import { Orders } from '../entities';

const dbConnectionMock = {
  findId: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeFind: jest.fn(),
  isValidId: jest.fn()
};

describe('OrdersGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  it('deve encontrar um pedido por ID com sucesso', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce({
      id: '1',
      customerId: '1',
      quantity: 1,
      amount: 100,
      status: 'RECEIVE',
      payment: 'APPROVED',
      orderDescription: 'Teste',
      created_at: new Date(),
      updated_at: new Date()
    });

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.findId('1');

    expect(result).toBeInstanceOf(Orders);
    expect(result?.quantity).toEqual(1);
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('orders', '1');
  });

  it('deve retornar null ao encontrar pedido por ID inexistente', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce(null);

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.findId('1');

    expect(result).toBeNull();
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('orders', '1');
  });

  it('deve retornar todos os pedidos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce([{
      id: '1',
      customerId: '1',
      quantity: 1,
      amount: 100,
      status: 'RECEIVE',
      payment: 'APPROVED',
      orderDescription: 'Teste',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result?.length).toEqual(1);
    expect(dbConnectionMock.findAll).toHaveBeenCalledWith('orders');
  });

  it('deve retornar null ao não encontrar pedidos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce(null);

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.findAll();

    expect(result).toBeNull();
    expect(dbConnectionMock.findAll).toHaveBeenCalledWith('orders');
  });

  it('deve remover um pedido existente corretamente', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(true);

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.remove('1');

    expect(result).toBe(true);
    expect(dbConnectionMock.remove).toHaveBeenCalledWith('orders', '1');
  });
});
