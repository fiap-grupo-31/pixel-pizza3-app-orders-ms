import { ProductsImagesGateway } from './ProductsImages';
import { type DbConnection } from '../interfaces/dbconnection';
import { ProductsImages } from '../entities';

const dbConnectionMock: jest.Mocked<DbConnection> = {
  findId: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeFind: jest.fn(),
  isValidId: jest.fn()
};

describe('ProductsImagesGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve encontrar uma imagem de produto por ID com sucesso', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce({
      id: '1',
      productId: 'product1',
      name: 'Image 1',
      size: 'medium',
      type: 'image/jpeg',
      base64: 'base64data',
      created_at: new Date(),
      updated_at: new Date()
    });

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.findId('1');

    expect(result).toBeInstanceOf(ProductsImages);
    expect(result?.name).toEqual('Image 1');
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('productsImages', '1');
  });

  it('deve encontrar uma imagem de produto por referência', async () => {
    dbConnectionMock.find.mockResolvedValueOnce([{
      id: '1',
      productId: 'product1',
      name: 'Image 1',
      size: 'medium',
      type: 'image/jpeg',
      base64: 'base64data',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result: any = await productsImagesGateway.find({
      _productId: 'product1'
    });

    expect(result[0]).toBeInstanceOf(ProductsImages);
    expect(dbConnectionMock.find).toHaveBeenCalledWith('productsImages', {
      _productId: 'product1'
    });
  });

  it('deve retornar null caso não ache uma imagem de produto por referência', async () => {
    dbConnectionMock.find.mockResolvedValueOnce(null);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result: any = await productsImagesGateway.find({
      _productId: 'product1'
    });

    expect(result).toBeNull();
    expect(dbConnectionMock.find).toHaveBeenCalledWith('productsImages', {
      _productId: 'product1'
    });
  });

  it('deve retornar null ao encontrar imagem de produto por ID inexistente', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce(null);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.findId('1');

    expect(result).toBeNull();
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('productsImages', '1');
  });

  it('deve retornar todas as imagens de produtos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce([{
      id: '1',
      productId: 'product1',
      name: 'Image 1',
      size: 'medium',
      type: 'image/jpeg',
      base64: 'base64data',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.findAll();

    expect(result?.length).toEqual(1);
  });

  it('deve retornar null caso não ache todas as imagens de produtos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce(null);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result: any = await productsImagesGateway.findAll();

    expect(result).toBeNull();
    expect(dbConnectionMock.findAll).toHaveBeenCalledWith('productsImages');
  });

  it('deve persistir uma nova imagem de produto', async () => {
    dbConnectionMock.persist.mockResolvedValueOnce(true);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.persist(
      'product1',
      'New Image',
      'medium',
      'image/jpeg',
      'base64data'
    );

    expect(result).toEqual(true);
  });

  it('deve atualizar uma imagem de produto existente', async () => {
    dbConnectionMock.update.mockResolvedValueOnce(true);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.update(
      '1',
      'Updated Image',
      'large',
      'image/png',
      'updatedbase64data'
    );

    expect(result).toEqual(true);
  });

  it('deve remover uma imagem de produto por ID', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(true);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.remove('1');

    expect(result).toEqual(true);
  });

  it('deve retornar false ao remover uma imagem de produto por ID', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(false);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.remove('1');

    expect(result).toEqual(false);
  });

  it('deve verificar se o ID é válido', async () => {
    dbConnectionMock.isValidId.mockResolvedValueOnce(true);

    const productsImagesGateway = new ProductsImagesGateway(dbConnectionMock);

    const result = await productsImagesGateway.isValidId('1');

    expect(result).toEqual(true);
  });
});
