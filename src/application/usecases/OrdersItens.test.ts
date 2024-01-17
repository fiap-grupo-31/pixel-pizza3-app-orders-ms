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

  it('should return all orders itens', async () => {
    mockGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await OrdersItensUseCases.getOrdersItensAll(mockGateway);
    expect(mockGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return null if not found', async () => {
    mockGateway.findAll.mockResolvedValueOnce(null);

    const result = await OrdersItensUseCases.getOrdersItensAll(mockGateway);
    expect(mockGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it('should throw if gateway throws', async () => {
    mockGateway.findAll.mockRejectedValueOnce(new Error('fail'));

    await expect(OrdersItensUseCases.getOrdersItensAll(mockGateway)).rejects.toThrow('fail');
  });

  it('should return the order item with the given id', async () => {
    const mockOrderItem = new OrdersItens('', '', '', 0, 0, '', '', '');
    const id = '1';

    mockGateway.findId.mockResolvedValue(mockOrderItem);

    const result = await OrdersItensUseCases.getOrdersItensById(id, mockGateway);

    expect(result).toEqual(mockOrderItem);
    expect(mockGateway.findId).toHaveBeenCalledWith(id);
  });

  it('should return null if not found', async () => {
    const id = '1';

    mockGateway.findId.mockResolvedValue(null);

    const result = await OrdersItensUseCases.getOrdersItensById(id, mockGateway);

    expect(result).toEqual(null);
    expect(mockGateway.findId).toHaveBeenCalledWith(id);
  });

  it('should throw if gateway throws', async () => {
    const id = '1';

    mockGateway.findId.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.getOrdersItensById(id, mockGateway)).rejects.toThrow('fail');
  });

  it('should return the order items with the given order id', async () => {
    const mockOrderItems = [new OrdersItens('', '', '', 0, 0, '', '', ''), new OrdersItens('', '', '', 0, 0, '', '', '')];
    const reference = { orderId: '1' };

    mockGateway.find.mockResolvedValue(mockOrderItems);

    const result = await OrdersItensUseCases.getOrdersItensByOrderId(reference, mockGateway);

    expect(result).toEqual(mockOrderItems);
    expect(mockGateway.find).toHaveBeenCalledWith(reference);
  });

  it('should return null if not found', async () => {
    const reference = { orderId: '1' };

    mockGateway.find.mockResolvedValue(null);

    const result = await OrdersItensUseCases.getOrdersItensByOrderId(reference, mockGateway);

    expect(result).toEqual(null);
    expect(mockGateway.find).toHaveBeenCalledWith(reference);
  });

  it('should throw if gateway throws', async () => {
    const reference = { orderId: '1' };

    mockGateway.find.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.getOrdersItensByOrderId(reference, mockGateway)).rejects.toThrow('fail');
  });

  it('should throw if orderId is invalid', async () => {
    const orderId = '1';
    const productId = '1';
    const price = 100;
    const quantity = 2;
    const obs = 'obs';

    mockGateway.isValidId.mockResolvedValue(false);

    await expect(OrdersItensUseCases.setOrdersItens(orderId, productId, price, quantity, obs, mockGateway)).rejects.toThrow('orderId inválid');
  });

  it('should throw if gateway throws', async () => {
    const id = '1';

    mockGateway.removeFind.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.removeOrdersItensByOrderId(id, mockGateway)).rejects.toThrow('id inexistent');
  });

  it('should remove the order items with the given order id', async () => {
    const id = '1';

    mockGateway.removeFind.mockResolvedValue(undefined);

    const result = await OrdersItensUseCases.removeOrdersItensByOrderId(id, mockGateway);

    expect(result).toEqual('removed');
    expect(mockGateway.removeFind).toHaveBeenCalledWith({ orderId: id });
  });

  it('should remove the order item with the given id', async () => {
    const id = '1';

    mockGateway.remove.mockResolvedValue(undefined);

    const result = await OrdersItensUseCases.removeOrdersItensById(id, mockGateway);

    expect(result).toEqual('removed');
    expect(mockGateway.remove).toHaveBeenCalledWith(id);
  });

  it('should throw if gateway throws', async () => {
    const id = '1';

    mockGateway.remove.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.removeOrdersItensById(id, mockGateway)).rejects.toThrow('id inexistent');
  });

  it('should update the order item with the given id and return the updated order item', async () => {
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

  it('should throw if gateway throws', async () => {
    const id = '1';
    const price = 100;
    const quantity = 2;
    const obs = 'obs';

    mockGateway.update.mockRejectedValue(new Error('fail'));

    await expect(OrdersItensUseCases.updateOrdersItens(id, price, quantity, obs, mockGateway)).rejects.toThrow('failure update');
  });
});
