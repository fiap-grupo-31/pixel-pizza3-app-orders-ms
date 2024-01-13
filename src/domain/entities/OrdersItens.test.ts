import { OrdersItens } from './OrdersItens';

describe('OrdersItens', () => {
  let ordersItens: OrdersItens;

  beforeEach(() => {
    ordersItens = new OrdersItens(
      '657e138ede2815270ca1d8dc',
      '657e138ede2815270ca1d8dc',
      'productId123',
      25.0,
      3,
      'Some observation',
      new Date('2023-10-12 12:00:00'),
      new Date('2023-10-12 12:15:00')
    );
  });

  it('Teste para verificar se a função get orderId retorna o valor correto', () => {
    expect(ordersItens.orderId).toBe('657e138ede2815270ca1d8dc');
  });

  it('Teste para verificar se a função get isValid retorna o valor correto', () => {
    expect(ordersItens.isValid).toBe(true);
  });

  it('Teste para verificar se a função get id retorna o valor correto', () => {
    expect(ordersItens.id).toBe('657e138ede2815270ca1d8dc');
  });

  it('Teste para verificar se a função get productId retorna o valor correto', () => {
    expect(ordersItens.productId).toBe('productId123');
  });

  it('Teste para verificar se a função get price retorna o valor correto', () => {
    expect(ordersItens.price).toBe(25.0);
  });

  it('Teste para verificar se a função get quantity retorna o valor correto', () => {
    expect(ordersItens.quantity).toBe(3);
  });

  it('Teste para verificar se a função get obs retorna o valor correto', () => {
    expect(ordersItens.obs).toBe('Some observation');
  });

  it('Teste para verificar se a função created_at retorna o valor correto', () => {
    expect(ordersItens.created_at).toEqual(new Date('2023-10-12 12:00:00'));
  });

  it('Teste para verificar se a função updated_at retorna o valor correto', () => {
    expect(ordersItens.updated_at).toEqual(new Date('2023-10-12 12:15:00'));
  });

  it('Teste para verificar se a função isValid retorna false em caso de id inválido', () => {
    const invalidOrdersItens = new OrdersItens(
      'invalid-id',
      'orderId123',
      'productId123',
      25.0,
      3,
      'Some observation',
      new Date('2023-10-12 12:00:00'),
      new Date('2023-10-12 12:15:00')
    );
    expect(invalidOrdersItens.isValid).toBe(false);
  });

  it('Teste para verificar se a função isValid retorna false em caso de id vazio', () => {
    const emptyIdOrdersItens = new OrdersItens(
      '',
      'orderId123',
      'productId123',
      25.0,
      3,
      'Some observation',
      new Date('2023-10-12 12:00:00'),
      new Date('2023-10-12 12:15:00')
    );
    expect(emptyIdOrdersItens.isValid).toBe(false);
  });
});
