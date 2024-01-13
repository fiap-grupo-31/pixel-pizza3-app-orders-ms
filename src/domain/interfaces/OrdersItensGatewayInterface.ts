import { type OrdersItens } from 'src/domain/entities/OrdersItens';

interface OrdersItensGatewayInterface {
  findId: (id: string) => Promise<OrdersItens | null>
  find: (Reference: Record<string, any>) => Promise<OrdersItens[] | null>
  removeFind: (Reference: Record<string, any>) => Promise<any>
  remove: (id: string) => Promise<any>
  findAll: () => Promise<OrdersItens[] | null>
  persist: (
    orderId: string,
    productId: string,
    price: number,
    quantity: number,
    obs: string
  ) => Promise<any>
  update: (
    id: string,
    price: number,
    quantity: number,
    obs: string
  ) => Promise<any>
  isValidId: (id: string) => Promise<boolean>
}

export type { OrdersItensGatewayInterface }
