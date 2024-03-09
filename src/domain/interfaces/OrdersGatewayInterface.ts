import { type Orders } from 'src/domain/entities/Orders';

interface OrdersGatewayInterface {
  findId: (id: string) => Promise<Orders | null>
  find: (Reference: Record<string, any>) => Promise<Orders[] | null>
  remove: (id: string) => Promise<any>
  findAll: () => Promise<Orders[] | null>
  persist: (
    customer: string | null,
    quantity: number,
    amount: number,
    status: string,
    payment: string,
    orderDescription: string
  ) => Promise<any>
  update: (
    id: string,
    customer: string | null,
    quantity: number,
    amount: number,
    status: string,
    payment: string,
    paymentReference: string,
    productionReference: string,
    orderDescription: string
  ) => Promise<any>
  isValidId: (id: string) => Promise<boolean>
}

export type { OrdersGatewayInterface }
