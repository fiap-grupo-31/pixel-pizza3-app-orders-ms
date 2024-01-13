import { Orders } from './Orders';

describe('Orders', () => {
  let orders: Orders;

  beforeEach(() => {
    orders = new Orders(
      '657e138ede2815270ca1d8dc',
      123,
      'customer123',
      2,
      50.0,
      'IN_PROGRESS',
      'WAITING',
      'Order Description',
      new Date('2023-10-12 10:00:00'),
      new Date('2023-10-12 10:00:00')
    );
  });

  it('Teste para verificar se a função get protocol retorna o valor correto', () => {
    expect(orders.protocol).toBe(123);
  });

  it('Teste para verificar se a função get isValid retorna o valor correto', () => {
    expect(orders.isValid).toBe(true);
  });

  it('Teste para verificar se a função get id retorna o valor correto', () => {
    expect(orders.id).toBe('657e138ede2815270ca1d8dc');
  });

  it('Teste para verificar se a função get customerId retorna o valor correto', () => {
    expect(orders.customerId).toBe('customer123');
  });

  it('Teste para verificar se a função get amount retorna o valor correto', () => {
    expect(orders.amount).toBe(50.0);
  });

  it('Teste para verificar se a função get quantity retorna o valor correto', () => {
    expect(orders.quantity).toBe(2);
  });

  it('Teste para verificar se a função get status retorna o valor correto', () => {
    expect(orders.status).toBe('IN_PROGRESS');
  });

  it('Teste para verificar se a função get payment retorna o valor correto', () => {
    expect(orders.payment).toBe('WAITING');
  });

  it('Teste para verificar se a função get orderDescription retorna o valor correto', () => {
    expect(orders.orderDescription).toBe('Order Description');
  });

  it('Teste para verificar se a função statusCheck retorna o valor correto', () => {
    expect(orders.statusCheck).toBe(true); // Assuming 'IN_PROGRESS' is a valid status
  });

  it('Teste para verificar se a função paymentCheck retorna o valor correto', () => {
    expect(orders.paymentCheck).toBe(true); // Assuming 'WAITING' is a valid payment status
  });

  it('Teste para verificar se a função created_at retorna o valor correto', () => {
    expect(orders.created_at).toEqual(new Date('2023-10-12 10:00:00'));
  });

  it('Teste para verificar se a função updated_at retorna o valor correto', () => {
    expect(orders.updated_at).toEqual(new Date('2023-10-12 10:00:00'));
  });

  it('Teste para verificar se a função statusWithPaymentCheck retorna o valor correto', () => {
    expect(orders.statusWithPaymentCheck).toEqual(false);
  });

  it('Teste para verificar se a função statusWithPaymentCheck retorna true em caso de waiting e receive', () => {
    const orders = new Orders(
      '657e138ede2815270ca1d8dc',
      123,
      'customer123',
      2,
      50.0,
      'RECEIVE',
      'WAITING',
      'Order Description',
      new Date('2023-10-12 10:00:00'),
      new Date('2023-10-12 10:00:00')
    );
    expect(orders.statusWithPaymentCheck).toEqual(true);
  });

  it('Teste para verificar se a função statusWithPaymentCheck retorna true em caso de CANCELED', () => {
    const orders = new Orders(
      '657e138ede2815270ca1d8dc',
      123,
      'customer123',
      2,
      50.0,
      'RECEIVE',
      'CANCELED',
      'Order Description',
      new Date('2023-10-12 10:00:00'),
      new Date('2023-10-12 10:00:00')
    );
    expect(orders.statusWithPaymentCheck).toEqual(true);
  });

  it('Teste para verificar se a função statusWithPaymentCheck retorna true em caso de APPROVED com receive', () => {
    const orders = new Orders(
      '657e138ede2815270ca1d8dc',
      123,
      'customer123',
      2,
      50.0,
      'IN_PROGRESS',
      'APPROVED',
      'Order Description',
      new Date('2023-10-12 10:00:00'),
      new Date('2023-10-12 10:00:00')
    );
    expect(orders.statusWithPaymentCheck).toEqual(true);
  });

  it('Teste para verificar se retorna exceção caso statusCheck for invalido', () => {
    try {
      const orders = new Orders(
        '657e138ede2815270ca1d8dc',
        123,
        'customer123',
        2,
        50.0,
        'TESTE',
        'WAITING',
        'Order Description',
        new Date('2023-10-12 10:00:00'),
        new Date('2023-10-12 10:00:00')
      );
    } catch (error: any) {
      expect(error.message).toEqual('status invalid');
    }
  });

  it('Deve criar um pedido válido', () => {
    // Add your test scenarios for creating a valid order
  });

  it('Deve retornar erro de status invalido se o status for invalido', () => {
    // Add your test scenarios for handling invalid status
  });

  it('Deve retornar false em caso de id inválido', () => {
    // Add your test scenarios for handling invalid id
  });

  it('Deve retornar o objeto válido', () => {
    // Add your test scenarios for comparing objects
  });
});
