/* eslint-disable @typescript-eslint/unbound-method */
import { CustomersController } from './customers';
import { CustomersUseCases } from '../../application/usecases';
import { Customers } from '../../domain/entities/Customers';
import { CustomersGateway } from '../../domain/gateways';
import { Global } from '../adapters';

const dbConnectionMock = {
  findId: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  removeFind: jest.fn(),
  findAll: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  isValidId: jest.fn()
};

const customersGatewayMock = new CustomersGateway(dbConnectionMock);

describe('CustomersController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCustomers', () => {
    it('deve retornar todos os clientes', async () => {
      const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
      jest.spyOn(CustomersUseCases, 'getCustomersAll').mockResolvedValueOnce([expectedCustomer]);

      const result = await CustomersController.getCustomers(null, dbConnectionMock);

      expect(result).toEqual(Global.success([expectedCustomer]));
      expect(CustomersUseCases.getCustomersAll).toHaveBeenCalledWith(customersGatewayMock);
    });

    it('deve retornar cliente por CPF', async () => {
      const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date(), new Date());
      jest.spyOn(CustomersUseCases, 'getCustomersByParameter').mockResolvedValueOnce([expectedCustomer]);

      const result = await CustomersController.getCustomers('12345678901', dbConnectionMock);

      expect(result).toEqual(Global.success([expectedCustomer]));
      expect(CustomersUseCases.getCustomersByParameter).toHaveBeenCalledWith(
        { cpf: '12345678901' },
        customersGatewayMock
      );
    });

    it('deve retornar erro em caso de falha', async () => {
      jest.spyOn(CustomersUseCases, 'getCustomersAll').mockRejectedValueOnce('Erro');

      const result = await CustomersController.getCustomers(null, dbConnectionMock);

      expect(result).toEqual(Global.error('Erro'));
      expect(CustomersUseCases.getCustomersAll).toHaveBeenCalledWith(customersGatewayMock);
    });

    it('deve retornar os clientes por ID', async () => {
      const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(CustomersUseCases, 'getCustomersById').mockResolvedValueOnce(expectedCustomer);

      const result = await CustomersController.getCustomersById('1213213', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"1213213","_name":"Anderson","_mail":"teste@teste.com.br","_cpf":"33811205811","_birthdate":"1990-01-01T00:00:00.000Z","_subscription":"premium","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}}');
    });

    it('deve cadastrar um novo cliente', async () => {
      const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(CustomersUseCases, 'setCustomer').mockResolvedValueOnce(expectedCustomer);

      const result = await CustomersController.setCustomer('Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"1213213","_name":"Anderson","_mail":"teste@teste.com.br","_cpf":"33811205811","_birthdate":"1990-01-01T00:00:00.000Z","_subscription":"premium","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}}');
    });

    it('deve atualizar um cliente por ID', async () => {
      const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(CustomersUseCases, 'updateCustomer').mockResolvedValueOnce(expectedCustomer);

      const result = await CustomersController.updateCustomer('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"1213213","_name":"Anderson","_mail":"teste@teste.com.br","_cpf":"33811205811","_birthdate":"1990-01-01T00:00:00.000Z","_subscription":"premium","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}}');
    });

    it('deve remover um clientes por ID', async () => {
      const expectedCustomer = new Customers('1213213', 'Anderson', 'teste@teste.com.br', '33811205811', new Date('1990-01-01'), 'premium', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(CustomersUseCases, 'removeCustomersById').mockResolvedValueOnce(expectedCustomer);

      const result = await CustomersController.removeCustomersById('1213213', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"1213213","_name":"Anderson","_mail":"teste@teste.com.br","_cpf":"33811205811","_birthdate":"1990-01-01T00:00:00.000Z","_subscription":"premium","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}}');
    });
  });
});
