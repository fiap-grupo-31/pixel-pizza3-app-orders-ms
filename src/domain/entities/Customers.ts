/* eslint-disable @typescript-eslint/naming-convention */
export class Customers {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _mail: string;
  private readonly _cpf: string;
  private readonly _birthdate: Date;
  private readonly _phone: string;
  private readonly _subscription: string;
  private readonly _created_at: Date;
  private readonly _updated_at: Date;

  constructor (
    id: string,
    name: string,
    mail: string,
    cpf: string,
    birthdate: Date,
    phone: string,
    subscription: string,
    created_at: any,
    updated_at: any
  ) {
    if (!this.isValidCpf(cpf)) {
      throw new Error('cpf invalid');
    }
    this._id = id;
    this._name = name;
    this._mail = mail;
    this._cpf = cpf.match(/\d+/g)?.toString() ?? '';
    this._birthdate = birthdate ?? new Date();
    this._phone = phone;
    this._subscription = subscription;
    this._created_at = created_at ?? '';
    this._updated_at = updated_at ?? '';
  }

  get name (): string {
    return this._name;
  }

  get id (): string {
    return this._id;
  }

  get mail (): string {
    return this._mail;
  }

  get cpf (): string {
    return this._cpf;
  }

  get birthdate (): Date {
    return this._birthdate;
  }

  get phone (): string {
    return this._phone;
  }

  get subscription (): string {
    return this._subscription;
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

  private isValidCpf (cpf: string): boolean {
    if (cpf === '') return true;
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[\s.-]*/gim, '');
    if (
      !cpf ||
      cpf.length !== 11 ||
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      return false;
    }
    let soma = 0;
    let resto;
    // eslint-disable-next-line no-var
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    // eslint-disable-next-line no-var, @typescript-eslint/no-redeclare
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }
}
