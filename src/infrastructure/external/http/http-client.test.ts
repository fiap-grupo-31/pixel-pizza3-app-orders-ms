import { type HttpClient } from './http-client';

describe('HttpClient Interface', () => {
  it('deve validar a estrutura da interface', () => {
    const httpClient: HttpClient = {
      get: jest.fn(),
      post: jest.fn()
    };

    expect(typeof httpClient.get).toBe('function');
    expect(typeof httpClient.post).toBe('function');
  });
});
