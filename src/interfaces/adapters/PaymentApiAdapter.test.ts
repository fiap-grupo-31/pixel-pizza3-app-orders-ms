import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { PaymentApiAdapter, type PaymentApiAdapterInterface } from './PaymentApiAdapter';

describe('PaymentApiAdapter', () => {
  const baseURL = 'http://example.com';
  let paymentApiAdapter: PaymentApiAdapterInterface;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    paymentApiAdapter = new PaymentApiAdapter(baseURL);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('deve criar um pagamento com sucesso', async () => {
    const mockResponseData = { status: 'success' };
    axiosMock.onPost('/payment/').reply(200, mockResponseData);

    const resultado = await paymentApiAdapter.createPayment('123', 'fake', 10, 100);

    expect(resultado).toBeTruthy();
  });

  it('deve retornar falso ao criar um pagamento com erro no servidor', async () => {
    axiosMock.onPost('/payment/').reply(500);

    const resultado = await paymentApiAdapter.createPayment('123', 'fake', 10, 100);

    expect(resultado).toBeFalsy();
  });

  it('deve retornar falso ao ocorrer um erro durante a criação do pagamento', async () => {
    axiosMock.onPost('/payment/').networkError();

    const resultado = await paymentApiAdapter.createPayment('123', 'fake', 10, 100);

    expect(resultado).toBeFalsy();
  });
});
