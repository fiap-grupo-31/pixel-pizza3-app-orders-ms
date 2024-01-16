/* eslint-disable @typescript-eslint/unbound-method */
import { ProductsController } from './products';
import { ProductsUseCases } from '../../application/usecases';
import { Products } from '../../domain/entities/Products';
import { ProductsGateway } from '../../domain/gateways';
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

const ProductsGatewayMock = new ProductsGateway(dbConnectionMock);

describe('ProductsController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('deve retornar todos os produtos', async () => {
      const expectedProduct = new Products('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsUseCases, 'getProductsAll').mockResolvedValueOnce([expectedProduct]);

      const result = await ProductsController.getProducts(null, dbConnectionMock);

      expect(result).toEqual(Global.success([expectedProduct]));
      expect(ProductsUseCases.getProductsAll).toHaveBeenCalledWith(ProductsGatewayMock);
    });

    it('deve retornar todos os produtos por categoria', async () => {
      const expectedProduct = new Products('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsUseCases, 'getOrdersByParameter').mockResolvedValueOnce([expectedProduct]);

      const result = await ProductsController.getProducts('DRINK', dbConnectionMock);

      expect(result).toEqual(Global.success([expectedProduct]));
    });

    it('deve retornar produto por ID', async () => {
      const expectedProduct = new Products('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsUseCases, 'getProductsById').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsController.getProductsById('1213213', dbConnectionMock);

      expect(result).toEqual({ data: { _category: 'DRINK', _created_at: new Date('1990-01-01'), _description: 'TESTE', _id: '1213213', _name: 'Suco', _price: 10, _updated_at: new Date('1990-01-01') }, status: 'success', statusCode: 200 });
    });

    it('deve cadastrar um novo produto', async () => {
      const expectedProduct = new Products('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsUseCases, 'setProduct').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsController.setProduct('Suco', 10.0, 'DRINK', 'TESTE', dbConnectionMock);

      expect(result.status).toEqual('success');
    });

    it('deve atualizar um produto por ID', async () => {
      const expectedProduct = new Products('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsUseCases, 'updateProduct').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsController.updateProduct('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', dbConnectionMock);

      expect(result.status).toEqual('success');
    });

    it('deve retornar falha ao atualizar um produto por ID', async () => {
      jest.spyOn(ProductsUseCases, 'updateProduct').mockResolvedValueOnce(Promise.reject(new Error('failure update')));

      try {
        await ProductsController.updateProduct('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', dbConnectionMock);
      } catch (error: any) {
        expect(error.message).toEqual('failure update');
      }
    });

    it('deve remover um produto por ID', async () => {
      const expectedProduct = new Products('1213213', 'Suco', 10.0, 'DRINK', 'TESTE', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsUseCases, 'removeProductsById').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsController.removeProductsById('1213213', dbConnectionMock);

      expect(result).toEqual({ data: { _category: 'DRINK', _created_at: new Date('1990-01-01'), _description: 'TESTE', _id: '1213213', _name: 'Suco', _price: 10, _updated_at: new Date('1990-01-01') }, status: 'success', statusCode: 200 });
    });

    it('deve retornar falha ao remover um produto por ID', async () => {
      jest.spyOn(ProductsUseCases, 'removeProductsById').mockResolvedValueOnce(Promise.reject(new Error('failure remove')));

      const result = await ProductsController.removeProductsById('1213213', dbConnectionMock);
      expect(result.status).toEqual('error');
    });
  });
});
