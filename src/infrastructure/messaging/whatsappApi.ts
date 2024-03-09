import { AxiosHttpClient } from '../../infrastructure/external/http/axios-client';

export interface MessageApi {
  sendMessage: (number: string, message: string) => Promise<void>
}

export class AxiosMessageApi implements MessageApi {
  private readonly apiUrl: string;

  constructor (apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async sendMessage (number: string, message: string): Promise<boolean> {
    try {
      const httpClient = new AxiosHttpClient('');
      const message = await httpClient.post(
        'https://cluster.apigratis.com/api/v2/whatsapp/sendText',
        {
          number: number,
          text: message,
          time_typing: 1
        }, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.TOKEN_WHATSAPP}`
          }
        }
      )

      if (message?.data?.message) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}
