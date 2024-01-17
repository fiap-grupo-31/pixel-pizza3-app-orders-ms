import { OrdersItensUseCases } from './OrdersItens';
import { OrdersItens } from '../../domain/entities/OrdersItens';

const mockGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeFind: jest.fn(),
  isValidId: jest.fn()
};

describe('OrdersItensUseCases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deverá trazer todos os itens do pedido', async () => {
    mockGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await OrdersItensUseCases.getOrdersItensAll(mockGateway);
    expect(mockGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('deve retornar um erro se o método findAll der erro', async () => {
    mockGateway.findAll.mockRejectedValueOnce(new Error('fail'));

    await expect(OrdersItensUseCases.getOrdersItensAll(mockGateway)).rejects.toThrow('fail');
  });

  it('deve retornar o item do pedido com o ID fornecido', async () => {
    const mockOrderItem = new OrdersItens('', '', '', 0, 0, '', '', '');
    const id = '1';

    mockGateway.findId.mockResolvedValue(mockOrderItem);

    const result = await OrdersItensUseCases.getOrdersItensById(id, mockGateway);

    expect(result).toEqual(mockOrderItem);
    expect(mockGateway.findId).toHaveBeenCalledWith(id);
  });

  it('deve retornar nulo se não for encontrado', async () => {
    const id = '1';

    mockGateway.findId.mockResolvedValue(null);

    const result = await OrdersItensUseCases.getOrdersItensById(id, mockGateway);

    expect(result).toEqual(null);
    expect(mockGateway.findId).toHaveBeenCalledWith(id);
  });

  it('deve retornar um erro se o método findId gerar um erro', async () => {
    const id = '1';

    mockGateway.findId.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.getOrdersItensById(id, mockGateway)).rejects.toThrow('fail');
  });

  it('deve retornar os itens do pedido com o ID do pedido fornecido', async () => {
    const mockOrderItems = [new OrdersItens('', '', '', 0, 0, '', '', ''), new OrdersItens('', '', '', 0, 0, '', '', '')];
    const reference = { orderId: '1' };

    mockGateway.find.mockResolvedValue(mockOrderItems);

    const result = await OrdersItensUseCases.getOrdersItensByOrderId(reference, mockGateway);

    expect(result).toEqual(mockOrderItems);
    expect(mockGateway.find).toHaveBeenCalledWith(reference);
  });

  it('deve retornar um erro se o método find gerar um erro', async () => {
    const reference = { orderId: '1' };

    mockGateway.find.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.getOrdersItensByOrderId(reference, mockGateway)).rejects.toThrow('fail');
  });

  it('deve retornar um erro se orderId for inválido', async () => {
    const orderId = '1';
    const productId = '1';
    const price = 100;
    const quantity = 2;
    const obs = 'obs';

    mockGateway.isValidId.mockResolvedValue(false);

    await expect(OrdersItensUseCases.setOrdersItens(orderId, productId, price, quantity, obs, mockGateway)).rejects.toThrow('orderId inválid');
  });

  it('deve retornar um erro se o método removeFind gerar um erro', async () => {
    const id = '1';

    mockGateway.removeFind.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.removeOrdersItensByOrderId(id, mockGateway)).rejects.toThrow('id inexistent');
  });

  it('deve remover os itens do pedido com o ID do pedido fornecido', async () => {
    const id = '1';

    mockGateway.removeFind.mockResolvedValue(undefined);

    const result = await OrdersItensUseCases.removeOrdersItensByOrderId(id, mockGateway);

    expect(result).toEqual('removed');
    expect(mockGateway.removeFind).toHaveBeenCalledWith({ orderId: id });
  });

  it('deve remover o item do pedido com o ID fornecido', async () => {
    const id = '1';

    mockGateway.remove.mockResolvedValue(undefined);

    const result = await OrdersItensUseCases.removeOrdersItensById(id, mockGateway);

    expect(result).toEqual('removed');
    expect(mockGateway.remove).toHaveBeenCalledWith(id);
  });

  it('deve retornar um erro se o método remove gerar um erro', async () => {
    const id = '1';

    mockGateway.remove.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.removeOrdersItensById(id, mockGateway)).rejects.toThrow('id inexistent');
  });

  it('deve atualizar o item do pedido com o ID fornecido e retornar o item do pedido atualizado', async () => {
    const id = '1';
    const price = 100;
    const quantity = 2;
    const obs = 'obs';
    const mockOrderItem = new OrdersItens(id, '', '', price, quantity, obs, '', '');

    mockGateway.update.mockResolvedValue(mockOrderItem);

    const result = await OrdersItensUseCases.updateOrdersItens(id, price, quantity, obs, mockGateway);

    expect(result).toEqual(mockOrderItem);
    expect(mockGateway.update).toHaveBeenCalledWith(id, price, quantity, obs);
  });

  it('deve retornar um erro se o método updateOrdersItens gerar um erro', async () => {
    const id = '1';
    const price = 100;
    const quantity = 2;
    const obs = 'obs';

    mockGateway.update.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.updateOrdersItens(id, price, quantity, obs, mockGateway)).rejects.toThrow('failure update');
  });

  it('deve retornar um erro se o método persist retornar um erro', async () => {
    const orderId = '1'.repeat(24);
    const productId = '1'.repeat(24);
    const price = 100;
    const quantity = 2;
    const obs = 'obs';

    mockGateway.isValidId.mockResolvedValue(true);

    mockGateway.persist.mockRejectedValue(new Error('failure insert'));

    await expect(OrdersItensUseCases.setOrdersItens(orderId, productId, price, quantity, obs, mockGateway)).rejects.toThrow('failure insert');
  });
});
