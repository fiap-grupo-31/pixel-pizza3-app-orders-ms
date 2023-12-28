/* eslint-disable @typescript-eslint/naming-convention */
export class Orders {
  private readonly _id: string;
  private readonly _protocol: number;
  private readonly _customerId: string;
  private readonly _quantity: number;
  private readonly _amount: number;
  private readonly _status: string;
  private readonly _payment: string;
  private readonly _orderDescription: string;
  private readonly _created_at: Date;
  private readonly _updated_at: Date;

  constructor (
    id: string,
    protocol: number,
    customerId: string | null,
    quantity: number | 0,
    amount: number | 0,
    status: string,
    payment: string | null,
    orderDescription: string | null,
    created_at: Date | any,
    updated_at: Date | any
  ) {
    this._id = id;
    this._protocol = protocol || 0;
    this._customerId = customerId ?? '';
    this._quantity = quantity || 0;
    this._amount = amount || 0;
    this._status = status || '';
    this._payment = payment ?? '';
    this._orderDescription = orderDescription ?? '';
    this._created_at = created_at || '';
    this._updated_at = updated_at || '';

    if (!this.statusCheck) {
      throw new Error('status invalid');
    }
  }

  get protocol (): number {
    return this._protocol;
  }

  get id (): string {
    return this._id;
  }

  get customerId (): string {
    return this._customerId;
  }

  get amount (): number {
    return this._amount;
  }

  get quantity (): number {
    return this._quantity;
  }

  get status (): string {
    return this._status;
  }

  get payment (): string {
    return this._payment;
  }

  get orderDescription (): string {
    return this._orderDescription;
  }

  get statusCheck (): boolean {
    return [
      'DONE', // PRONTO
      'FINISH', // FINALIZADO ( ENTREGUE )
      'IN_PROGRESS', // PREPARANDO
      'RECEIVE', // RECEBIDO NO SISTEMA
      'CANCELED' // CANCELADO
    ].includes(this._status);
  }

  get paymentCheck (): boolean {
    return [
      'NONE', // AGUARDANDO
      'WAITING', // AGUARDANDO
      'APPROVED', // APROVADO
      'DENIED', // NEGADO
      'CANCELED' // NEGADO
    ].includes(this._payment);
  }

  get created_at (): Date {
    return this._created_at;
  }

  get updated_at (): Date {
    return this._updated_at;
  }

  get statusWithPaymentCheck (): boolean {
    if (
      ['WAITING', 'APPROVED', 'NONE'].includes(this._payment) &&
      ['RECEIVE'].includes(this._status)
    ) {
      return true;
    }

    if (
      ['CANCELED', 'DENIED'].includes(this._payment) &&
      ['CANCELED', 'RECEIVE'].includes(this._status)
    ) {
      return true;
    }

    if (
      ['APPROVED'].includes(this._payment) &&
      ['RECEIVE', 'IN_PROGRESS', 'FINISH', 'DONE'].includes(this._status)
    ) {
      return true;
    }

    return false;
  }

  get isValid (): boolean {
    return !!(this._id && this._id.length === 24);
  }
}
