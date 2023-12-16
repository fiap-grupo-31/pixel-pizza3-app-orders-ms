/* eslint-disable @typescript-eslint/naming-convention */
export class ProductsImages {
  private readonly _id: string;
  private readonly _productId: string;
  private readonly _name: string;
  private readonly _size: string;
  private readonly _type: string;
  private readonly _base64: string;
  private readonly _created_at: Date;
  private readonly _updated_at: Date;

  constructor (
    id: string,
    productId: string,
    name: string,
    size: string,
    type: string,
    base64: string,
    created_at: Date | any,
    updated_at: Date | any
  ) {
    this._id = id;
    this._productId = productId || '';
    this._name = name || '';
    this._size = size || '';
    this._type = type || '';
    this._base64 = base64 || '';
    this._created_at = created_at || '';
    this._updated_at = updated_at || '';
  }

  get name (): string {
    return this._name;
  }

  get id (): string {
    return this._id;
  }

  get productId (): string {
    return this._productId;
  }

  get size (): string {
    return this._size;
  }

  get type (): string {
    return this._type;
  }

  get base64 (): string {
    return this._base64;
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
