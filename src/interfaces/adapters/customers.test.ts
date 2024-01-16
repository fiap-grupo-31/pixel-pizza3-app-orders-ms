import { CustomerAdapter } from './customers';

describe('CustomerAdapter', () => {
  it('deve adaptar o objeto do cliente corretamente', () => {
    const data = {
      data: {
        campo: 'valor'
      }
    };

    const resultado = CustomerAdapter.adaptObjectCustomer(data);

    expect(resultado).toEqual({ campo: 'valor' });
  });

  it('deve retornar um objeto vazio se os dados forem nulos', () => {
    const data = null;

    const resultado = CustomerAdapter.adaptObjectCustomer(data);

    expect(resultado).toEqual({});
  });

  it('deve retornar um objeto vazio se ocorrer um erro ao analisar os dados', () => {
    const data = 'dados inválidos';

    const resultado = CustomerAdapter.adaptObjectCustomer(data);

    expect(resultado).toEqual({});
  });
});
