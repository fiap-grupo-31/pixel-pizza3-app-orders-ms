import { Products } from './Products';

describe('Products', () => {
  it('deve criar uma instância válida de Products', () => {
    const id = '123456789012345678901234';
    const name = 'ProdutoA';
    const price = 19.99;
    const category = 'DRINK';
    const description = 'Bebida refrescante';
    const createdAt = new Date('2022-01-01');
    const updatedAt = new Date('2022-01-02');

    const produto = new Products(id, name, price, category, description, createdAt, updatedAt);

    expect(produto).toBeInstanceOf(Products);
    expect(produto.id).toEqual(id);
    expect(produto.name).toEqual(name);
    expect(produto.price).toEqual(price);
    expect(produto.category).toEqual(category);
    expect(produto.description).toEqual(description);
    expect(produto.created_at).toEqual(createdAt);
    expect(produto.updated_at).toEqual(updatedAt);
  });

  it('deve lançar um erro ao criar uma instância inválida de Products', () => {
    const id = '';
    const name = 'ProdutoB';
    const price = 15.99;
    const category = 'SNACKS';
    const description = 'Lanche saboroso';
    const createdAt = new Date('2022-01-01');
    const updatedAt = new Date('2022-01-02');

    expect(() => new Products(id, name, price, category, description, createdAt, updatedAt)).toThrowError();
  });

  it('deve verificar corretamente a categoria', () => {
    const produto = new Products('123456789012345678901234', 'ProdutoC', 25.99, 'DESSERT', 'Sobremesa deliciosa', new Date(), new Date());

    expect(produto.categoryCheck).toBeTruthy();
  });

  it('deve verificar corretamente a validade do produto', () => {
    const produtoValido = new Products('123456789012345678901234', 'ProdutoD', 12.99, 'ACCOMPANIMENT', 'Acompanhamento saboroso', new Date(), new Date());
    const produtoInvalido = new Products('', 'ProdutoE', 8.99, 'SNACK', 'Lanche leve', new Date(), new Date());
    expect(produtoValido.isValid).toBeTruthy();
    expect(produtoInvalido.isValid).toBeFalsy();
  });
});
