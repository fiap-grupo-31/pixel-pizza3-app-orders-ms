import { ProductsUseCases } from './Products';
import { Products } from '../../domain/entities/Products';

const mockGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
};

describe('ProductsUseCases', () => {
  it('deve retornar todos os produtos quando getProductsAll é chamado', async () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }];
    mockGateway.findAll.mockResolvedValue(mockProducts);

    const result = await ProductsUseCases.getProductsAll(mockGateway);
    expect(result).toEqual(mockProducts);
  });

  it('deve retornar produtos por parâmetro quando getOrdersByParameter é chamado', async () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }];
    const reference = { name: 'Product 1' };
    mockGateway.find.mockResolvedValue(mockProducts);

    const result = await ProductsUseCases.getOrdersByParameter(reference, mockGateway);
    expect(result).toEqual(mockProducts);
  });

  it('deve retornar um produto por id quando getProductsById é chamado', async () => {
    const mockProduct = { id: '1', name: 'Product 1' };
    mockGateway.findId.mockResolvedValue(mockProduct);

    const result = await ProductsUseCases.getProductsById('1', mockGateway);
    expect(result).toEqual(mockProduct);
  });

  it('deve remover um produto por id quando removeProductsById é chamado', async () => {
    mockGateway.remove.mockResolvedValue('removed');

    const result = await ProductsUseCases.removeProductsById('1', mockGateway);
    expect(result).toEqual('removed');
  });

  it('deve lançar um erro quando nenhum nome é fornecido', async () => {
    await expect(ProductsUseCases.setProduct('', 100, 'Category 1', 'Description 1', mockGateway)).rejects.toThrow('nome inválid');
  });

  it('deve lançar um erro quando nenhum preço é fornecido', async () => {
    await expect(ProductsUseCases.setProduct('Product 1', 0, 'Category 1', 'Description 1', mockGateway)).rejects.toThrow('price inválid');
  });

  it('deve lançar um erro quando nenhuma categoria é fornecida', async () => {
    await expect(ProductsUseCases.setProduct('Product 1', 100, '', 'Description 1', mockGateway)).rejects.toThrow('category inválid');
  });

  it('deve lançar um erro quando nenhum nome é fornecido no update', async () => {
    await expect(ProductsUseCases.updateProduct('1', '', 100, 'Category 1', 'Description 1', mockGateway)).rejects.toThrow('nome inválid');
  });

  it('deve lançar um erro quando nenhum preço é fornecido no update', async () => {
    await expect(ProductsUseCases.updateProduct('1', 'Product 1', 0, 'Category 1', 'Description 1', mockGateway)).rejects.toThrow('price inválid');
  });

  it('deve lançar um erro quando nenhuma categoria é fornecida no update', async () => {
    await expect(ProductsUseCases.updateProduct('1', 'Product 1', 100, '', 'Description 1', mockGateway)).rejects.toThrow('category inválid');
  });

  it('deve lançar um erro se o método remove no gateway lançar um erro', async () => {
    const id = '1';

    mockGateway.remove.mockRejectedValue(new Error('fail'));

    await expect(ProductsUseCases.removeProductsById(id, mockGateway)).rejects.toThrow('id inexistent');
  });

  it('deve criar um produto quando setProduct é chamado com parâmetros válidos', async () => {
    const mockProduct = { _id: '1', name: 'Product 1', price: 100, category: 'DRINK', description: 'Description 1', created_at: null, updated_at: null };
    mockGateway.persist.mockResolvedValue(mockProduct);

    const result = await ProductsUseCases.setProduct('Product 1', 100, 'DRINK', 'Description 1', mockGateway);
    expect(result).toEqual(new Products(
      mockProduct._id,
      mockProduct.name,
      mockProduct.price,
      mockProduct.category,
      mockProduct.description,
      mockProduct.created_at,
      mockProduct.updated_at
    ));
  });

  it('deve lançar um erro quando setProduct é chamado e o gateway falha ao persistir o produto', async () => {
    mockGateway.persist.mockRejectedValue(new Error('fail'));

    await expect(ProductsUseCases.setProduct('Product 1', 100, 'DRINK', 'Description 1', mockGateway)).rejects.toThrow('fail');
  });
});
