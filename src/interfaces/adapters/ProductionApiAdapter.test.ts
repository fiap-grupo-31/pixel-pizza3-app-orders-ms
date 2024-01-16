import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ProductionApiAdapter, type ProductionApiAdapterInterface } from './ProductionApiAdapter';

describe('ProductionApiAdapter', () => {
  const baseURL = 'http://example.com';
  let productionApiAdapter: ProductionApiAdapterInterface;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    productionApiAdapter = new ProductionApiAdapter(baseURL);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('deve criar uma produção com sucesso', async () => {
    const mockResponseData = { status: 'success' };
    axiosMock.onPost('/production/').reply(200, mockResponseData);

    const resultado = await productionApiAdapter.createProduction('123', 'protocoloA', 'Descrição do pedido');

    expect(resultado).toBeTruthy();
  });

  it('deve retornar falso ao criar uma produção com erro no servidor', async () => {
    axiosMock.onPost('/production/').reply(500);

    const resultado = await productionApiAdapter.createProduction('123', 'protocoloA', 'Descrição do pedido');

    expect(resultado).toBeFalsy();
  });

  it('deve retornar falso ao ocorrer um erro durante a criação da produção', async () => {
    axiosMock.onPost('/production/').networkError();

    const resultado = await productionApiAdapter.createProduction('123', 'protocoloA', 'Descrição do pedido');

    expect(resultado).toBeFalsy();
  });
});
