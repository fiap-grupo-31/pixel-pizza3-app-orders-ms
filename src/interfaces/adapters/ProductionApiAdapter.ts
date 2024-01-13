import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export interface ProductionApiAdapterInterface {
  createProduction: (orderId: string, protocol: string, orderDescription: string) => Promise<boolean>
}

export class ProductionApiAdapter implements ProductionApiAdapterInterface {
  private readonly axiosInstance: AxiosInstance;

  constructor (baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL
    });
  }

  async createProduction (orderId: string, protocol: string, orderDescription: string): Promise<boolean> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post('/production/', {
        orderId,
        protocol,
        orderDescription
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
