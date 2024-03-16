import { type CustomersGatewayInterface } from './CustomersGatewayInterface';
import { Customers } from '../../domain/entities/Customers';

const mockCustomer: Customers = new Customers('123', 'John Doe', 'john@example.com', '33811205811', new Date('1990-01-01'), '5511988398795', 'premium', new Date(), new Date());

const customersGatewayMock: CustomersGatewayInterface | any = {
  findId: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  findAll: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  isValidId: jest.fn()
};

describe('CustomersGatewayInterface', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar findId corretamente', async () => {
    const customerId = '123';
    customersGatewayMock.findId.mockResolvedValue(mockCustomer);
    const resultado = await customersGatewayMock.findId(customerId);

    expect(resultado).toEqual(mockCustomer);
    expect(customersGatewayMock.findId).toHaveBeenCalledWith(customerId);
  });

  it('deve chamar find corretamente', async () => {
    const reference = { name: 'John' };
    customersGatewayMock.find.mockResolvedValue([mockCustomer]);

    const resultado = await customersGatewayMock.find(reference);

    expect(resultado).toEqual([mockCustomer]);
    expect(customersGatewayMock.find).toHaveBeenCalledWith(reference);
  });

  it('deve chamar remove corretamente', async () => {
    const customerId = '123';
    customersGatewayMock.remove.mockResolvedValue(undefined);

    const resultado = await customersGatewayMock.remove(customerId);

    expect(resultado).toBeUndefined();
    expect(customersGatewayMock.remove).toHaveBeenCalledWith(customerId);
  });

  it('deve chamar findAll corretamente', async () => {
    customersGatewayMock.findAll.mockResolvedValue([mockCustomer]);

    const resultado = await customersGatewayMock.findAll();

    expect(resultado).toEqual([mockCustomer]);
    expect(customersGatewayMock.findAll).toHaveBeenCalled();
  });

  it('deve chamar persist corretamente', async () => {
    const newCustomer = {
      name: 'Jane Doe',
      mail: 'jane@example.com',
      cpf: '98765432109',
      birthdate: new Date('1995-01-01'),
      subscription: 'basic'
    };
    customersGatewayMock.persist.mockResolvedValue(undefined);

    const resultado = await customersGatewayMock.persist(
      newCustomer.name,
      newCustomer.mail,
      newCustomer.cpf,
      newCustomer.birthdate,
      newCustomer.subscription
    );

    expect(resultado).toBeUndefined();
    expect(customersGatewayMock.persist).toHaveBeenCalledWith(
      newCustomer.name,
      newCustomer.mail,
      newCustomer.cpf,
      newCustomer.birthdate,
      newCustomer.subscription
    );
  });

  it('deve chamar update corretamente', async () => {
    const customerId = '123';
    const updatedCustomer = {
      name: 'Updated Doe',
      mail: 'updated@example.com',
      cpf: '98765432109',
      birthdate: new Date('1995-01-01'),
      subscription: 'basic'
    };
    customersGatewayMock.update.mockResolvedValue(undefined);

    const resultado = await customersGatewayMock.update(
      customerId,
      updatedCustomer.name,
      updatedCustomer.mail,
      updatedCustomer.cpf,
      updatedCustomer.birthdate,
      updatedCustomer.subscription
    );

    expect(resultado).toBeUndefined();
    expect(customersGatewayMock.update).toHaveBeenCalledWith(
      customerId,
      updatedCustomer.name,
      updatedCustomer.mail,
      updatedCustomer.cpf,
      updatedCustomer.birthdate,
      updatedCustomer.subscription
    );
  });

  it('deve chamar isValidId corretamente', async () => {
    const customerId = '123';
    customersGatewayMock.isValidId.mockResolvedValue(true);

    const resultado = await customersGatewayMock.isValidId(customerId);

    expect(resultado).toBe(true);
    expect(customersGatewayMock.isValidId).toHaveBeenCalledWith(customerId);
  });
});
