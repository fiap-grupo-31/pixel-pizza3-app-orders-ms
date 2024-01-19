import { OrdersItemsGateway } from './OrdersItens';
import { type DbConnection } from '../interfaces/dbconnection';
import { OrdersItens } from '../entities';

// Mock para DbConnection
const dbConnectionMock: jest.Mocked<DbConnection> = {
  findId: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeFind: jest.fn(),
  isValidId: jest.fn()
};

describe('OrdersItemsGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve encontrar itens de pedidos por referência', async () => {
    dbConnectionMock.find.mockResolvedValueOnce([{
      id: '1',
      orderId: 'order1',
      productId: 'product1',
      price: 50.0,
      quantity: 2,
      obs: 'Special instructions',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result: any = await ordersItemsGateway.find({
      _orderId: 'order1'
    });

    expect(result[0]).toBeInstanceOf(OrdersItens);
    expect(dbConnectionMock.find).toHaveBeenCalledWith('ordersItens', {
      _orderId: 'order1'
    });
  });

  it('deve retornar null caso não ache itens de pedidos por referência', async () => {
    dbConnectionMock.find.mockResolvedValueOnce(null);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result: any = await ordersItemsGateway.find({
      _orderId: 'order1'
    });

    expect(result).toBeNull();
    expect(dbConnectionMock.find).toHaveBeenCalledWith('ordersItens', {
      _orderId: 'order1'
    });
  });

  it('deve encontrar um item de pedido por ID com sucesso', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce({
      id: '1',
      orderId: 'order1',
      productId: 'product1',
      price: 50.0,
      quantity: 2,
      obs: 'Special instructions',
      created_at: new Date(),
      updated_at: new Date()
    });

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.findId('1');

    expect(result).toBeInstanceOf(OrdersItens);
    expect(result?.obs).toEqual('Special instructions');
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('ordersItens', '1');
  });

  it('deve retornar null ao encontrar um item de pedido por ID inexistente', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce(null);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.findId('1');

    expect(result).toBeNull();
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('ordersItens', '1');
  });

  it('deve retornar todos os itens de pedidos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce([{
      id: '1',
      orderId: 'order1',
      productId: 'product1',
      price: 50.0,
      quantity: 2,
      obs: 'Special instructions',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.findAll();

    expect(result?.length).toEqual(1);
  });

  it('deve retornar null caso não ache todos os itens de pedidos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce(null);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result: any = await ordersItemsGateway.findAll();

    expect(result).toBeNull();
    expect(dbConnectionMock.findAll).toHaveBeenCalledWith('ordersItens');
  });

  it('deve persistir um novo item de pedido', async () => {
    dbConnectionMock.persist.mockResolvedValueOnce(true);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.persist(
      'order1',
      'product1',
      50.0,
      2,
      'Special instructions'
    );

    expect(result).toEqual(true);
  });

  it('deve atualizar um item de pedido existente', async () => {
    dbConnectionMock.update.mockResolvedValueOnce(true);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.update(
      '1',
      60.0,
      3,
      'Updated instructions'
    );

    expect(result).toEqual(true);
  });

  it('deve remover um item de pedido por ID', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(true);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.remove('1');

    expect(result).toEqual(true);
  });

  it('deve retornar false ao remover um item de pedido por ID', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(false);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.remove('1');

    expect(result).toEqual(false);
  });

  it('deve remover itens de pedido por referência', async () => {
    dbConnectionMock.removeFind.mockResolvedValueOnce(true);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.removeFind({
      _orderId: 'order1'
    });

    expect(result).toEqual(true);
  });

  it('deve verificar se o ID é válido', async () => {
    dbConnectionMock.isValidId.mockResolvedValueOnce(true);

    const ordersItemsGateway = new OrdersItemsGateway(dbConnectionMock);

    const result = await ordersItemsGateway.isValidId('1');

    expect(result).toEqual(true);
  });
});
