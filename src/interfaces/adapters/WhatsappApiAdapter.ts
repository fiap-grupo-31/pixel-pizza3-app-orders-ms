import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export interface WhatsappApiAdapterInterface {
  sendMessage: (number: string, message: string) => Promise<boolean>
}

export class WhatsappApiAdapter implements WhatsappApiAdapterInterface {
  private readonly axiosInstance: AxiosInstance;

  constructor () {
    this.axiosInstance = axios.create({
    });
  }

  async sendMessage (number: string, message: string): Promise<boolean> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        'https://cluster.apigratis.com/api/v2/whatsapp/sendText', {
          number,
          text: message,
          time_typing: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            DeviceToken: '4915d6bb-4b31-47c5-a387-8671ae408dc9',
            Authorization: 'Bearer ' + process.env.TOKEN_WHATSAPP
          }
        });

      if (response.status !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
