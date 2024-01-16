/* eslint-disable @typescript-eslint/unbound-method */
import { ProductsImagesController } from './productsImages';
import { ProductsImagesUseCases } from '../../application/usecases';
import { ProductsImages } from '../../domain/entities/ProductsImages';
import { ProductsImagesGateway } from '../../domain/gateways';

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

const ProductsImagesGatewayMock = new ProductsImagesGateway(dbConnectionMock);

describe('ProductsImagesController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('deve retornar todos os produtos images', async () => {
      const expectedProduct = new ProductsImages('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsImagesUseCases, 'getProductsImagesAll').mockResolvedValueOnce([expectedProduct]);

      const result = await ProductsImagesController.getProductsImages(dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":"1213213","_productId":"1234567892","_name":"Teste","_size":"10000","_type":"DRINK","_base64":"data:base64;","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}]}');
      expect(ProductsImagesUseCases.getProductsImagesAll).toHaveBeenCalledWith(ProductsImagesGatewayMock);
    });

    it('deve retornar falha ao buscar todos os produtos images', async () => {
      jest.spyOn(ProductsImagesUseCases, 'getProductsImagesAll').mockResolvedValueOnce(Promise.reject(new Error('failure get')));

      const result = await ProductsImagesController.getProductsImages(dbConnectionMock);

      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
      expect(ProductsImagesUseCases.getProductsImagesAll).toHaveBeenCalledWith(ProductsImagesGatewayMock);
    });

    it('deve retornar produto images por ID', async () => {
      const expectedProduct = new ProductsImages('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsImagesUseCases, 'getProductsImagesByProductId').mockResolvedValueOnce([expectedProduct]);

      const result = await ProductsImagesController.getProductsImagesByProductId({
        _id: '1213213'
      }, dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":"1213213","_productId":"1234567892","_name":"Teste","_size":"10000","_type":"DRINK","_base64":"data:base64;","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}]}');
    });

    it('deve cadastrar um novo produto imagem', async () => {
      const expectedProduct = new ProductsImages('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsImagesUseCases, 'setProductImage').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsImagesController.setProductImage('1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', dbConnectionMock);

      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":"1213213","_productId":"1234567892","_name":"Teste","_size":"10000","_type":"DRINK","_base64":"data:base64;","_created_at":"1990-01-01T00:00:00.000Z","_updated_at":"1990-01-01T00:00:00.000Z"}}');
    });

    it('deve atualizar um produto imagem por ID', async () => {
      const expectedProduct = new ProductsImages('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsImagesUseCases, 'updateProductImage').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsImagesController.updateProductImage('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', dbConnectionMock);

      expect(JSON.parse(result).status).toEqual('success');
    });

    it('deve retornar falha ao atualizar um produto imagem por ID', async () => {
      jest.spyOn(ProductsImagesUseCases, 'updateProductImage').mockResolvedValueOnce(Promise.reject(new Error('failure update')));

      const result = await ProductsImagesController.updateProductImage('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', dbConnectionMock);

      expect(JSON.parse(result).status).toEqual('error');
    });

    it('deve remover um produto imagem por ID', async () => {
      const expectedProduct = new ProductsImages('1213213', '1234567892', 'Teste', '10000', 'DRINK', 'data:base64;', new Date('1990-01-01'), new Date('1990-01-01'));
      jest.spyOn(ProductsImagesUseCases, 'removeProductsImagesById').mockResolvedValueOnce(expectedProduct);

      const result = await ProductsImagesController.removeProductsImagesById('1213213', dbConnectionMock);

      expect(JSON.parse(result).status).toEqual('success');
    });

    it('deve retornar falha ao remover um produto imagem por ID', async () => {
      jest.spyOn(ProductsImagesUseCases, 'removeProductsImagesById').mockResolvedValueOnce(Promise.reject(new Error('failure remove')));

      const result = await ProductsImagesController.removeProductsImagesById('1213213', dbConnectionMock);
      expect(JSON.parse(result).status).toEqual('error');
    });
  });
});
