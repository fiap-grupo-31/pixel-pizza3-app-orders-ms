import { ProductsAdapter } from './products';
import { Products } from '../../domain/entities/Products';

describe('ProductsAdapter', () => {
  it('deve adaptar os produtos corretamente para JSON', () => {
    const dados: Products[] = [
      new Products('1', 'ProdutoA', 1, 'DESSERT', 'teste', new Date(), new Date()),
      new Products('2', 'ProdutoB', 1, 'DESSERT', 'teste', new Date(), new Date()),
      new Products('3', 'ProdutoC', 1, 'DESSERT', 'teste', new Date(), new Date())
    ];

    const resultado = ProductsAdapter.adaptJsonProducts(dados);

    expect(resultado).toEqual(JSON.stringify([{ name: 'ProdutoA', id: '1' }, { name: 'ProdutoB', id: '2' }, { name: 'ProdutoC', id: '3' }]));
  });

  it('deve retornar um objeto vazio como JSON se os dados forem nulos', () => {
    const dados: Products[] | null = null;

    const resultado = ProductsAdapter.adaptJsonProducts(dados);

    expect(resultado).toEqual(JSON.stringify({}));
  });
});
