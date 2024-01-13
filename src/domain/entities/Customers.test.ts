import { Customers } from './Customers';

describe('Customers', () => {
  let customers: Customers;

  // Setup - criar uma nova instância da classe Payments antes de cada teste
  beforeEach(() => {
    customers = new Customers(
      '657e138ede2815270ca1d8dc',
      'John Doe',
      'john@example.com',
      '04207262091',
      new Date('1990-01-01'),
      'subscription',
      new Date('2023-10-12 10:00:00'),
      new Date('2023-10-12 10:00:00')
    );
  });

  it('Teste para verificar se a função get name retorna o valor correto', () => {
    expect(customers.name).toBe('John Doe');
  });

  it('Teste para verificar se a função get birthdate retorna o valor correto', () => {
    expect(customers.birthdate).toEqual(new Date('1990-01-01'));
  });

  it('Teste para verificar se a função get created_at retorna o valor correto', () => {
    expect(customers.created_at).toEqual(new Date('2023-10-12 10:00:00'));
  });

  it('Teste para verificar se a função get updated_at retorna o valor correto', () => {
    expect(customers.updated_at).toEqual(new Date('2023-10-12 10:00:00'));
  });

  it('Teste para verificar se a função get id retorna o valor correto', () => {
    expect(customers.id).toBe('657e138ede2815270ca1d8dc');
  });

  it('Teste para verificar se a função get cpf retorna o valor correto', () => {
    expect(customers.cpf).toBe('04207262091');
  });

  it('Teste para verificar se a função get mail retorna o valor correto', () => {
    expect(customers.mail).toBe('john@example.com');
  });

  it('Teste para verificar se a função get subscription retorna o valor correto', () => {
    expect(customers.subscription).toBe('subscription');
  });

  it('Deve criar um cliente válido', () => {
    const validCustomer = new Customers(
      '657e138ede2815270ca1d8dc',
      'John Doe',
      'john@example.com',
      '04207262091',
      new Date('1990-01-01'),
      'subscription',
      new Date(),
      new Date()
    );

    expect(validCustomer.isValid).toBe(true);
  });

  it('Deve retornar erro de cpf invalido se o cpf for invalido', () => {
    try {
      const validCustomer = new Customers(
        '657e138ede2815270ca1d8dc',
        'John Doe',
        'john@example.com',
        '0000',
        new Date('1990-01-01'),
        'subscription',
        new Date(),
        new Date()
      );
      expect(validCustomer.isValid).toBe(true);
    } catch (error: any) {
      expect(error.message).toBe('cpf invalid');
    }
  });

  it('Deve retornar erro de cpf sucesso se o cpf for vazio', () => {
    try {
      const validCustomer = new Customers(
        '657e138ede2815270ca1d8dc',
        'John Doe',
        'john@example.com',
        '',
        new Date('1990-01-01'),
        'subscription',
        new Date(),
        new Date()
      );
      expect(validCustomer.isValid).toBe(true);
    } catch (error: any) {
      expect(error.message).toBe('cpf invalid');
    }
  });

  it('Deve retornar false em caso de id inválido', () => {
    const validCustomer = new Customers(
      '123',
      'John Doe',
      'john@example.com',
      '04207262091',
      new Date('1990-01-01'),
      'subscription',
      new Date(),
      new Date()
    );

    expect(validCustomer.isValid).toBe(false);
  });

  it('Deve retornar o objeto válido', () => {
    const customer = new Customers(
      '657e138ede2815270ca1d8dc',
      'John Doe',
      'john@example.com',
      '04207262091',
      new Date('1990-01-01'),
      'subscription',
      new Date('2023-10-12 10:00:00'),
      new Date('2023-10-12 10:00:00')
    );

    expect(customer).toEqual(customers);
  });
});
