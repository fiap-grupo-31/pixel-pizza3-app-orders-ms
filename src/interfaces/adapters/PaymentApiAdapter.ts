import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';

export interface PaymentApiAdapterInterface {
  createPayment: (orderId: string, broker: string, quantity: number, amount: number) => Promise<boolean>
}

export class PaymentApiAdapter implements PaymentApiAdapterInterface {
  private readonly axiosInstance: AxiosInstance;

  constructor (baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL
    });
  }

  async createPayment (orderId: string, broker: string, quantity: number, amount: number): Promise<boolean> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post('/payment/', {
        orderId,
        broker,
        quantity,
        amount
      });

      if (response.status !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
