import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { WhatsappApiAdapter, type WhatsappApiAdapterInterface } from './WhatsappApiAdapter';

describe('WhatsappApiAdapter', () => {
  let whatsappApiAdapter: WhatsappApiAdapterInterface;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    whatsappApiAdapter = new WhatsappApiAdapter();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('deve enviar uma msg com sucesso', async () => {
    const mockResponseData = { status: 'success' };
    axiosMock.onPost('https://cluster.apigratis.com/api/v2/whatsapp/sendText').reply(200, mockResponseData);

    const resultado = await whatsappApiAdapter.sendMessage('123', 'teste');

    expect(resultado).toBeTruthy();
  });

  it('deve retornar falso ao enviar uma msg com sucesso', async () => {
    axiosMock.onPost('https://cluster.apigratis.com/api/v2/whatsapp/sendText').reply(500);

    const resultado = await whatsappApiAdapter.sendMessage('123', 'teste');

    expect(resultado).toBeFalsy();
  });
});
