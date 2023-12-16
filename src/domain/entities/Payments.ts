/* eslint-disable @typescript-eslint/naming-convention */
export class Payments {
  private readonly _id: string;
  private readonly _orderId: string;
  private readonly _broker: string;
  private readonly _status: string;
  private readonly _description: string;
  private readonly _created_at: Date;
  private readonly _updated_at: Date;

  constructor (
    id: string,
    orderId: string,
    broker: string,
    status: string,
    description: string,
    created_at: Date | any,
    updated_at: Date | any
  ) {
    this._id = id;
    this._orderId = orderId || '';
    this._broker = broker || '';
    this._status = status || '';
    this._description = description || '';
    this._created_at = created_at || '';
    this._updated_at = updated_at || '';
  }

  get orderId (): string {
    return this._orderId;
  }

  get id (): string {
    return this._id;
  }

  get broker (): string {
    return this._broker;
  }

  get status (): string {
    return this._status;
  }

  get description (): string {
    return this._description;
  }

  get paymentCheck (): boolean {
    return [
      'WAITING', // AGUARDANDO
      'APPROVED', // APROVADO
      'DENIED', // NEGADO
      'CANCELED' // NEGADO
    ].includes(this._status);
  }

  get created_at (): Date {
    return this._created_at;
  }

  get updated_at (): Date {
    return this._updated_at;
  }

  get isValid (): boolean {
    return !!(this._id && this._id.length === 24);
  }
}
