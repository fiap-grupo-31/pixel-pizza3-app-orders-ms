import { ProductsImages } from './ProductsImages';

describe('ProductsImages', () => {
  let productsImages: ProductsImages;

  beforeEach(() => {
    productsImages = new ProductsImages(
      '657e138ede2815270ca1d8dc',
      '657e138ede2815270ca1d8dc',
      'ImageName',
      'Large',
      'JPEG',
      'base64encodedstring',
      new Date('2023-10-12 14:30:00'),
      new Date('2023-10-12 14:45:00')
    );
  });

  it('Teste para verificar se a função get name retorna o valor correto', () => {
    expect(productsImages.name).toBe('ImageName');
  });

  it('Teste para verificar se a função get isValid retorna o valor correto', () => {
    expect(productsImages.isValid).toBe(true);
  });

  it('Teste para verificar se a função get id retorna o valor correto', () => {
    expect(productsImages.id).toBe('657e138ede2815270ca1d8dc');
  });

  it('Teste para verificar se a função get productId retorna o valor correto', () => {
    expect(productsImages.productId).toBe('657e138ede2815270ca1d8dc');
  });

  it('Teste para verificar se a função get size retorna o valor correto', () => {
    expect(productsImages.size).toBe('Large');
  });

  it('Teste para verificar se a função get type retorna o valor correto', () => {
    expect(productsImages.type).toBe('JPEG');
  });

  it('Teste para verificar se a função get base64 retorna o valor correto', () => {
    expect(productsImages.base64).toBe('base64encodedstring');
  });

  it('Teste para verificar se a função created_at retorna o valor correto', () => {
    expect(productsImages.created_at).toEqual(new Date('2023-10-12 14:30:00'));
  });

  it('Teste para verificar se a função updated_at retorna o valor correto', () => {
    expect(productsImages.updated_at).toEqual(new Date('2023-10-12 14:45:00'));
  });

  it('Teste para verificar se a função isValid retorna false em caso de id inválido', () => {
    const invalidProductsImages = new ProductsImages(
      'invalid-id',
      'productId456',
      'ImageName',
      'Large',
      'JPEG',
      'base64encodedstring',
      new Date('2023-10-12 14:30:00'),
      new Date('2023-10-12 14:45:00')
    );
    expect(invalidProductsImages.isValid).toBe(false);
  });

  it('Teste para verificar se a função isValid retorna false em caso de id vazio', () => {
    const emptyIdProductsImages = new ProductsImages(
      '',
      'productId456',
      'ImageName',
      'Large',
      'JPEG',
      'base64encodedstring',
      new Date('2023-10-12 14:30:00'),
      new Date('2023-10-12 14:45:00')
    );
    expect(emptyIdProductsImages.isValid).toBe(false);
  });

  // Add more test cases as needed
});
