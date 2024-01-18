import { ProductsImagesUseCases } from './ProductsImages';
import { ProductsImages } from '../../domain/entities/ProductsImages';

const mockGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  isValidId: jest.fn()
};

const mockProductsGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
};

describe('ProductsImagesUseCases', () => {
  it('deve obter todas as imagens do produto', async () => {
    const mockProductsImages = [
      new ProductsImages('', '', '', '', '', '', '', ''),
      new ProductsImages('', '', '', '', '', '', '', '')
    ];
    mockGateway.findAll.mockResolvedValue(mockProductsImages);

    const result = await ProductsImagesUseCases.getProductsImagesAll(mockGateway);

    expect(result).toEqual(mockProductsImages);
    expect(mockGateway.findAll).toHaveBeenCalled();
  });

  it('deve obter imagens do produto por id do produto', async () => {
    const mockProductsImages = [
      new ProductsImages('1', 'product1', 'name1', 'size1', 'type1', 'base64_1', 'createdAt1', 'updatedAt1'),
      new ProductsImages('2', 'product1', 'name2', 'size2', 'type2', 'base64_2', 'createdAt2', 'updatedAt2')
    ];
    const reference = { productId: 'product1' };
    mockGateway.find.mockResolvedValue(mockProductsImages);

    const result = await ProductsImagesUseCases.getProductsImagesByProductId(reference, mockGateway);

    expect(result).toEqual(mockProductsImages);
    expect(mockGateway.find).toHaveBeenCalledWith(reference);
  });

  it('deve obter imagens do produto por id', async () => {
    const mockProductImage = new ProductsImages('1', 'product1', 'name1', 'size1', 'type1', 'base64_1', 'createdAt1', 'updatedAt1');
    const id = '1';
    mockGateway.findId.mockResolvedValue(mockProductImage);

    const result = await ProductsImagesUseCases.getProductsImagesById(id, mockGateway);

    expect(result).toEqual(mockProductImage);
    expect(mockGateway.findId).toHaveBeenCalledWith(id);
  });

  it('deve definir a imagem do produto', async () => {
    const productId = '123456789012345678901234'; // productId com 24 caracteres
    const name = 'name1';
    const size = 'size1';
    const type = 'type1';
    const base64 = 'base64_1';
    const mockProductImage = new ProductsImages('1', 'product1', 'name1', 'size1', 'type1', 'base64_1', 'createdAt1', 'updatedAt1');
    const mockProduct = { _id: '1', name: 'product1' };

    mockGateway.isValidId.mockResolvedValue(true);
    mockGateway.persist.mockResolvedValue(mockProductImage);
    mockProductsGateway.findId.mockResolvedValue(mockProduct);

    const result = await ProductsImagesUseCases.setProductImage(productId, name, size, type, base64, mockGateway, mockProductsGateway);

    expect(result).toEqual(mockProductImage);
    expect(mockGateway.isValidId).toHaveBeenCalledWith(productId);
    expect(mockGateway.persist).toHaveBeenCalledWith(productId, name, size, type, base64);
    expect(mockProductsGateway.findId).toHaveBeenCalledWith(productId);
  });

  it('deve lançar erro quando productId não é fornecido', async () => {
    await expect(ProductsImagesUseCases.setProductImage('', 'name', 'size', 'type', 'base64', mockGateway, mockProductsGateway))
      .rejects.toThrow('id product inválid');
  });

  it('deve lançar erro quando o comprimento do productId não é 24', async () => {
    await expect(ProductsImagesUseCases.setProductImage('123', 'name', 'size', 'type', 'base64', mockGateway, mockProductsGateway))
      .rejects.toThrow('id product inválid');
  });

  it('deve lançar erro quando o nome não é fornecido', async () => {
    await expect(ProductsImagesUseCases.setProductImage('123456789012345678901234', '', 'size', 'type', 'base64', mockGateway, mockProductsGateway))
      .rejects.toThrow('name inválid');
  });

  it('deve lançar erro quando o tamanho não é fornecido', async () => {
    await expect(ProductsImagesUseCases.setProductImage('123456789012345678901234', 'name', '', 'type', 'base64', mockGateway, mockProductsGateway))
      .rejects.toThrow('size inválid');
  });

  it('deve lançar erro quando o tipo não é fornecido', async () => {
    await expect(ProductsImagesUseCases.setProductImage('123456789012345678901234', 'name', 'size', '', 'base64', mockGateway, mockProductsGateway))
      .rejects.toThrow('type inválid');
  });

  it('deve lançar erro quando base64 não é fornecido', async () => {
    await expect(ProductsImagesUseCases.setProductImage('123456789012345678901234', 'name', 'size', 'type', '', mockGateway, mockProductsGateway))
      .rejects.toThrow('base64 inválid');
  });

  it('should update product image', async () => {
    const id = '123456789012345678901234'; // id com 24 caracteres
    const productId = '123456789012345678901234'; // productId com 24 caracteres
    const name = 'name1';
    const size = 'size1';
    const type = 'type1';
    const base64 = 'base64_1';
    const mockProductImage = new ProductsImages('1', 'product1', 'name1', 'size1', 'type1', 'base64_1', 'createdAt1', 'updatedAt1');

    mockGateway.isValidId.mockResolvedValue(true);
    mockGateway.find.mockResolvedValue([mockProductImage]);
    mockGateway.update.mockResolvedValue(mockProductImage);

    const result = await ProductsImagesUseCases.updateProductImage(id, productId, name, size, type, base64, mockGateway);

    expect(result).toEqual(mockProductImage);
    expect(mockGateway.isValidId).toHaveBeenCalledWith(id);
    expect(mockGateway.isValidId).toHaveBeenCalledWith(productId);
    expect(mockGateway.find).toHaveBeenCalledWith({ _id: id, productId });
    expect(mockGateway.update).toHaveBeenCalledWith(id, name, size, type, base64);
  });

  it('should throw error when id is not provided', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('', '123456789012345678901234', 'name', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('id image inválid');
  });

  it('should throw error when id length is not 24', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123', '123456789012345678901234', 'name', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('id image inválid');
  });

  it('should throw error when productId is not provided', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '', 'name', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('id product inválid');
  });

  it('should throw error when productId length is not 24', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123', 'name', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('id product inválid');
  });

  it('should throw error when name is not provided', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123456789012345678901234', '', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('name inválid');
  });

  it('should throw error when size is not provided', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123456789012345678901234', 'name', '', 'type', 'base64', mockGateway))
      .rejects.toThrow('size inválid');
  });

  it('should throw error when type is not provided', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123456789012345678901234', 'name', 'size', '', 'base64', mockGateway))
      .rejects.toThrow('type inválid');
  });

  it('should throw error when base64 is not provided', async () => {
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123456789012345678901234', 'name', 'size', 'type', '', mockGateway))
      .rejects.toThrow('base64 inválid');
  });

  it('should throw error when id is not valid', async () => {
    mockGateway.isValidId.mockResolvedValue(false);
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123456789012345678901234', 'name', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('id image inválid');
  });

  it('should throw error when productId is not valid', async () => {
    mockGateway.isValidId.mockResolvedValueOnce(true).mockResolvedValue(false);
    await expect(ProductsImagesUseCases.updateProductImage('123456789012345678901234', '123456789012345678901234', 'name', 'size', 'type', 'base64', mockGateway))
      .rejects.toThrow('id product inválid');
  });

  it('should remove product image by id', async () => {
    const id = '123456789012345678901234'; // id com 24 caracteres

    mockGateway.remove.mockResolvedValue('removed');

    const result = await ProductsImagesUseCases.removeProductsImagesById(id, mockGateway);

    expect(result).toEqual('removed');
    expect(mockGateway.remove).toHaveBeenCalledWith(id);
  });

  it('should throw error when id is inexistent', async () => {
    const id = '123456789012345678901234'; // id com 24 caracteres

    mockGateway.remove.mockRejectedValue(new Error('id inexistent'));

    await expect(ProductsImagesUseCases.removeProductsImagesById(id, mockGateway))
      .rejects.toThrow('id inexistent');
  });
});
