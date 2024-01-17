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

  it('deve retornar false ao tentar remover um pedido inexistente', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(false);

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.remove('1');

    expect(result).toBe(false);
    expect(dbConnectionMock.remove).toHaveBeenCalledWith('orders', '1');
  });

  it('deve retornar false ao tentar atualizar um pedido inexistente', async () => {
    dbConnectionMock.update.mockResolvedValueOnce(false);

    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.update('1', '1', 1, 100, 'RECEIVE', 'APPROVED', 'Teste');

    expect(result).toBe(false);
  });

  it('deve retornar null quando o resultado for null', async () => {
    dbConnectionMock.find.mockResolvedValueOnce(null);
    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.find({});

    expect(result).toBeNull();
    expect(dbConnectionMock.find).toHaveBeenCalledWith('orders', {});
  });

  it('deve retornar um array de Orders quando o resultado não for null', async () => {
    const mockData = [
      {
        id: '1',
        protocol: '1',
        customerId: '1',
        quantity: 1,
        amount: 100,
        status: 'RECEIVE',
        payment: 'APPROVED',
        orderDescription: 'Teste',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    dbConnectionMock.find.mockResolvedValueOnce(mockData);
    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.find({});

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    if (result !== null) {
      expect(result[0]).toBeInstanceOf(Orders);
    }
    expect(dbConnectionMock.find).toHaveBeenCalledWith('orders', {});
  });

  it('deve retornar true quando o ID é válido', async () => {
    dbConnectionMock.isValidId.mockResolvedValue(true);
    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.isValidId('1');

    expect(result).toBe(true);
  });

  it('deve retornar false quando o ID não é válido', async () => {
    dbConnectionMock.isValidId.mockResolvedValue(false);
    const ordersGateway = new OrdersGateway(dbConnectionMock);

    const result = await ordersGateway.isValidId('invalid-id');

    expect(result).toBe(false);
  });
});
