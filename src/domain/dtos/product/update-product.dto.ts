export class UpdateProductDto {
  private constructor (
    public readonly name     : string,
    public readonly capacity : number,
    public readonly height   : number,
    public readonly diameter : number,
    public readonly price    : number,
  ) {}

  static update( object: { [Key: string]: any } ): [string?, UpdateProductDto?] {
    const { name, capacity, height, diameter, price } = object;

    if( name || capacity || height || diameter || price ) {
      if( name && (typeof name !== "string") ) return ['Name is not string'];
      if( capacity && (typeof Number(capacity) !== "number") ) return ['Capacity is not number'];
      if( height && (typeof Number(height) !== "number") ) return ['Height is not number'];
      if( diameter && (typeof Number(diameter) !== "number") ) return ['Diameter is not number'];
      if( price && (typeof Number(price) !== "number") ) return ['Price is not number'];
    }


    return [undefined, new UpdateProductDto( name, capacity, height, diameter, price )];
  }
}