import { CustomersUseCases } from './Customers';
import { Customers } from '../../domain/entities/Customers';

const customersGatewayMock = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  isValidId: jest.fn()
};

describe('CustomersUseCases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter todos os clientes corretamente', async () => {
    const customer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date(), '', new Date(), new Date());
    const expectedCustomers: Customers[] = [customer];
    customersGatewayMock.findAll.mockResolvedValue(expectedCustomers);

    const resultado = await CustomersUseCases.getCustomersAll(customersGatewayMock);

    expect(resultado).toEqual(expectedCustomers);
    expect(customersGatewayMock.findAll).toHaveBeenCalledTimes(1);

    customersGatewayMock.findAll.mockResolvedValueOnce([
    ]);
  });

  it('deve obter clientes por parâmetro corretamente', async () => {
    const customer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date(), '', new Date(), new Date());
    const reference = { name: 'Anderson' };
    const expectedCustomers: Customers[] = [customer];
    customersGatewayMock.find.mockResolvedValue(expectedCustomers);

    const resultado = await CustomersUseCases.getCustomersByParameter(reference, customersGatewayMock);

    expect(resultado).toEqual(expectedCustomers);
    expect(customersGatewayMock.find).toHaveBeenCalledWith(reference);
  });

  it('deve obter um cliente por ID corretamente', async () => {
    const customerId = '1213213';
    const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date(), '', new Date(), new Date());
    customersGatewayMock.findId.mockResolvedValue(expectedCustomer);

    const resultado = await CustomersUseCases.getCustomersById(customerId, customersGatewayMock);

    expect(resultado).toEqual(expectedCustomer);
    expect(customersGatewayMock.findId).toHaveBeenCalledWith(customerId);
  });

  it('deve criar um novo cliente corretamente', async () => {
    const name = 'Anderson';
    const mail = 'teste@teste.com.br';
    const cpf = '33811205811';
    const birthdate = new Date('1990-01-01');
    const subscription = 'premium';

    const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
    customersGatewayMock.persist.mockResolvedValue(expectedCustomer);

    const resultado = await CustomersUseCases.setCustomer(name, mail, cpf, birthdate, subscription, customersGatewayMock);

    expect(resultado).toEqual(expectedCustomer);
    expect(customersGatewayMock.persist).toHaveBeenCalledWith(name, mail, cpf, birthdate, subscription);
  });

  it('deve retornar erro em um novo cliente quando enviado incorretamente', async () => {
    const mail = 'teste@teste.com.br';
    const cpf = '33811205811';
    const birthdate = new Date('1990-01-01');
    const subscription = 'premium';

    const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
    customersGatewayMock.persist.mockResolvedValue(expectedCustomer);

    try {
      await CustomersUseCases.setCustomer('', mail, cpf, birthdate, subscription, customersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('nome inválid');
    }
  });

  it('deve retornar erro em um novo cliente quando há falha', async () => {
    const name = 'Anderson';
    const mail = 'teste@teste.com.br';
    const cpf = '33811205811';
    const birthdate = new Date('1990-01-01');
    const subscription = 'premium';

    customersGatewayMock.persist.mockResolvedValue(Promise.reject(new Error('Erro ao persistir')));

    try {
      await CustomersUseCases.setCustomer(name, mail, cpf, birthdate, subscription, customersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('Erro ao persistir');
    }
  });

  it('deve atualizar um cliente por id', async () => {
    const id = '1213213';
    const name = 'Anderson';
    const mail = 'teste@teste.com.br';
    const cpf = '33811205811';
    const birthdate = new Date('1990-01-01');
    const subscription = 'premium';

    const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
    customersGatewayMock.update.mockResolvedValue(expectedCustomer);

    const resultado = await CustomersUseCases.updateCustomer(id, name, mail, cpf, birthdate, subscription, customersGatewayMock);

    expect(resultado).toEqual(expectedCustomer);
    expect(customersGatewayMock.update).toHaveBeenCalledWith(id, name, mail, cpf, birthdate, subscription);
  });

  it('deve retornar erro ao atualizar um cliente quando enviado incorretamente', async () => {
    const id = '1213213';
    const mail = 'teste@teste.com.br';
    const cpf = '33811205811';
    const birthdate = new Date('1990-01-01');
    const subscription = 'premium';

    const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
    customersGatewayMock.update.mockResolvedValue(expectedCustomer);

    try {
      await CustomersUseCases.updateCustomer(id, '', mail, cpf, birthdate, subscription, customersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('nome inválid');
    }
  });

  it('deve retornar erro ao atualizar um cliente quando enviado incorretamente', async () => {
    const id = '1213213';
    const name = 'Anderson';
    const mail = 'teste@teste.com.br';
    const cpf = '33811205811';
    const birthdate = new Date('1990-01-01');
    const subscription = 'premium';

    customersGatewayMock.update.mockResolvedValue(Promise.reject(new Error('failure update')));

    try {
      await CustomersUseCases.updateCustomer(id, name, mail, cpf, birthdate, subscription, customersGatewayMock);
    } catch (error: any) {
      expect(error.message).toEqual('failure update');
    }
  });
});
