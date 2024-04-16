export class CreateProductDto {
  private constructor (
    public readonly name     : string,
    public readonly capacity : number,
    public readonly height   : number,
    public readonly diameter : number,
    public readonly price    : number,
  ) {}

  static create( object: { [Key: string]: any } ): [string?, CreateProductDto?] {
    const { name, capacity, height, diameter, price } = object;

    if ( !name ) return ['Missing product name'];
    if ( !capacity ) return ['Missing product price'];
    if ( !height ) return ['Missing product price'];
    if ( !diameter ) return ['Missing product price'];
    if ( !price ) return ['Missing product price'];

    return [undefined, new CreateProductDto( name, capacity, height, diameter, price )];
  }
}