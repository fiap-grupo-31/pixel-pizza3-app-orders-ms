import { CustomersGateway } from './Customers';
import { Customers } from '../entities';

// Mock para DbConnection
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

describe('CustomersGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve encontrar um cliente por ID com sucesso', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce({
      id: '1',
      name: 'John Doe',
      mail: 'john@example.com',
      cpf: '33811205811',
      birthdate: '1990-01-01',
      subscription: 'premium',
      created_at: new Date(),
      updated_at: new Date()
    });

    const customersGateway = new CustomersGateway(dbConnectionMock);

    const result = await customersGateway.findId('1');

    expect(result).toBeInstanceOf(Customers);
    expect(result?.name).toEqual('John Doe');
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('customers', '1');
  });

  it('deve retornar null ao encontrar cliente por ID inexistente', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce(null);

    const customersGateway = new CustomersGateway(dbConnectionMock);

    const result = await customersGateway.findId('1');

    expect(result).toBeNull();
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('customers', '1');
  });

  it('deve retornar todos os clientes', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce([{
      id: '1',
      name: 'John Doe',
      mail: 'john@example.com',
      cpf: '33811205811',
      birthdate: '1990-01-01',
      subscription: 'premium',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const customersGateway = new CustomersGateway(dbConnectionMock);

    const result = await customersGateway.findAll();

    expect(result?.length).toEqual(1);
  });

  it('deve remover um cliente e por id', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(true);

    const customersGateway = new CustomersGateway(dbConnectionMock);

    const result = await customersGateway.remove('1');

    expect(result).toEqual(true);
  });

  it('deve retornar false ao remover um cliente e por id', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(false);

    const customersGateway = new CustomersGateway(dbConnectionMock);

    const result = await customersGateway.remove('1');

    expect(result).toEqual(false);
  });

  it('deve se o id é valido', async () => {
    dbConnectionMock.isValidId.mockResolvedValueOnce(true);

    const customersGateway = new CustomersGateway(dbConnectionMock);

    const result = await customersGateway.isValidId('1');

    expect(result).toEqual(true);
  });
});
