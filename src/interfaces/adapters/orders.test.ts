import { OrdersAdapter } from './orders'; // Substitua pelo caminho real do seu arquivo

describe('OrdersAdapter', () => {
  it('deve adaptar e ordenar corretamente os pedidos abertos', async () => {
    const data = [
      { id: 1, nome: 'Pedido1', data: '2024-01-16', data2: '2024-01-16' },
      { id: 2, nome: 'Pedido2', data: '2024-01-15', data2: '2024-01-10' },
      { id: 3, nome: 'Pedido3', data: '2024-01-17', data2: '2024-01-16' }
    ];

    const resultado = await OrdersAdapter.adaptSortOrdersOpen(data, 'data', 'data2');

    expect(resultado).toEqual([
      { id: 2, nome: 'Pedido2', data: '2024-01-15', data2: '2024-01-10' },
      { id: 1, nome: 'Pedido1', data: '2024-01-16', data2: '2024-01-16' },
      { id: 3, nome: 'Pedido3', data: '2024-01-17', data2: '2024-01-16' }
    ]);
  });

  it('deve adaptar e ordenar corretamente os pedidos abertos quando a data 1 for tudo igual', async () => {
    const data = [
      { id: 1, nome: 'Pedido1', data: '2024-01-16', data2: '2024-01-16' },
      { id: 2, nome: 'Pedido2', data: '2024-01-16', data2: '2024-01-10' },
      { id: 3, nome: 'Pedido3', data: '2024-01-16', data2: '2024-01-16' }
    ];

    const resultado = await OrdersAdapter.adaptSortOrdersOpen(data, 'data', 'data2');

    expect(resultado).toEqual([
      { id: 2, nome: 'Pedido2', data: '2024-01-16', data2: '2024-01-10' },
      { id: 1, nome: 'Pedido1', data: '2024-01-16', data2: '2024-01-16' },
      { id: 3, nome: 'Pedido3', data: '2024-01-16', data2: '2024-01-16' }
    ]);
  });

  it('deve retornar uma lista vazia se os dados forem um array vazio', async () => {
    const data: any = [];

    const resultado = await OrdersAdapter.adaptSortOrdersOpen(data, 'data', 'data2');

    expect(resultado).toEqual([]);
  });
});
