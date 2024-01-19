import { type ParametroBd } from '@types';

export interface DbConnection {
  findId: (Schema: string, Id: string) => Promise<any>
  find: (Schema: string, Reference: Record<string, any>) => Promise<any[] | null>
  remove: (Schema: string, Id: string) => Promise<any>
  removeFind: (Schema: string, Reference: Record<string, any>) => Promise<any>
  findAll: (Schema: string) => Promise<any[] | null>
  persist: (Schema: string, parametros: ParametroBd[] | Object) => Promise<any>
  update: (Schema: string, Id: string, parametros: ParametroBd[] | Object) => Promise<any>
  isValidId: (Id: string) => Promise<any>
}
