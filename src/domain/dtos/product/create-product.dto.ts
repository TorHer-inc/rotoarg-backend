export class CreateProductDto {
  private constructor (
    public readonly name         : string,
    public readonly price        : number,
    public readonly description? : string,
  ) {}

  static create( object: { [Key: string]: any } ): [string?, CreateProductDto?] {
    const { name, price, description } = object;

    if ( !name ) return ['Missing product name'];
    if ( !price ) return ['Missing product price'];

    return [undefined, new CreateProductDto( name, price, description )];
  }
}