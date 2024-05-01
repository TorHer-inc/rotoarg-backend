export class UpdateProductDto {
  private constructor (
    public readonly id        : string,
    public readonly name?     : string,
    public readonly capacity? : number,
    public readonly height?   : number,
    public readonly diameter? : number,
    public readonly price?    : number,
  ) {}

  get values() {
    const returnObj: {[key: string]: any} = {};

    if ( this.name ) returnObj.name = this.name;
    if ( this.capacity ) returnObj.capacity = this.capacity;
    if ( this.height ) returnObj.height = this.height;
    if ( this.diameter ) returnObj.diameter = this.diameter;
    if ( this.price ) returnObj.price = this.price;

    return returnObj;
  }

  static create( object: { [Key: string]: any } ): [string?, UpdateProductDto?] {
    const { id, name, capacity, height, diameter, price } = object;

    return [undefined, new UpdateProductDto( id, name, capacity, height, diameter, price )];
  }
}