import { ProductsGateway } from './Products';
import { type DbConnection } from '../interfaces/dbconnection';
import { Products } from '../entities';

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

describe('ProductsGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve encontrar um produto por ID com sucesso', async () => {
    dbConnectionMock.findId.mockResolvedValueOnce({
      id: '1',
      name: 'Product 1',
      price: 19.99,
      category: 'ACCOMPANIMENT',
      description: 'Delicious product',
      created_at: new Date(),
      updated_at: new Date()
    });

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.findId('1');

    expect(result).toBeInstanceOf(Products);
    expect(result?.name).toEqual('Product 1');
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('products', '1');
  });

  it('deve encontrar um produto por referência', async () => {
    dbConnectionMock.find.mockResolvedValueOnce([{
      id: '1',
      name: 'Product 1',
      price: 19.99,
      category: 'ACCOMPANIMENT',
      description: 'Delicious product',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result: any = await productsGateway.find({
      _category: 'ACCOMPANIMENT'
    });

    expect(result[0]).toBeInstanceOf(Products);
    expect(dbConnectionMock.find).toHaveBeenCalledWith('products', {
      _category: 'ACCOMPANIMENT'
    });
  });

  it('deve retornar null caso não ache um produto por referência', async () => {
    dbConnectionMock.find.mockResolvedValueOnce(null);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result: any = await productsGateway.find({
      _category: 'ACCOMPANIMENT'
    });

    expect(result).toBeNull();
    expect(dbConnectionMock.find).toHaveBeenCalledWith('products', {
      _category: 'ACCOMPANIMENT'
    });
  });

  it('deve retornar null ao encontrar produto por ID inexistente', async () => {
    // Mock da implementação do controlador
    dbConnectionMock.findId.mockResolvedValueOnce(null);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.findId('1');

    expect(result).toBeNull();
    expect(dbConnectionMock.findId).toHaveBeenCalledWith('products', '1');
  });

  it('deve retornar todos os produtos', async () => {
    // Mock da implementação do controlador
    dbConnectionMock.findAll.mockResolvedValueOnce([{
      id: '1',
      name: 'Product 1',
      price: 19.99,
      category: 'ACCOMPANIMENT',
      description: 'Delicious product',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.findAll();

    expect(result?.length).toEqual(1);
  });

  it('deve retornar null caso não ache todos os produtos', async () => {
    dbConnectionMock.findAll.mockResolvedValueOnce(null);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result: any = await productsGateway.findAll();

    expect(result).toBeNull();
    expect(dbConnectionMock.findAll).toHaveBeenCalledWith('products');
  });

  it('deve persistir um novo produto', async () => {
    dbConnectionMock.persist.mockResolvedValueOnce(true);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.persist(
      'New Product',
      29.99,
      'ACCOMPANIMENT',
      'Delicious new product'
    );

    expect(result).toEqual(true);
  });

  it('deve atualizar um produto existente', async () => {
    dbConnectionMock.update.mockResolvedValueOnce(true);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.update(
      '1',
      'Hamburguer',
      39.99,
      'ACCOMPANIMENT',
      'Updated description'
    );

    expect(result).toEqual(true);
  });

  it('deve remover um produto por ID', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(true);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.remove('1');

    expect(result).toEqual(true);
  });

  it('deve retornar false ao remover um produto por ID', async () => {
    dbConnectionMock.remove.mockResolvedValueOnce(false);

    const productsGateway = new ProductsGateway(dbConnectionMock);

    const result = await productsGateway.remove('1');

    expect(result).toEqual(false);
  });
});
