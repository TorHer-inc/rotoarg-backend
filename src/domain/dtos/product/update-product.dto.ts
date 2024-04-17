// export class UpdateProductDto {
//   private constructor (
//     public readonly name     : string,
//     public readonly capacity : number,
//     public readonly height   : number,
//     public readonly diameter : number,
//     public readonly price    : number,
//   ) {}

//   static update( object: { [Key: string]: any } ): [string?, UpdateProductDto?] {
//     const { name, capacity, height, diameter, price } = object;

//     if ( name || capacity || height || diameter || price ) {
//       if ( name && (typeof name !== "string") ) return ['Name is not string'];
//       if ( capacity && (typeof Number(capacity) !== "number") ) return ['Capacity is not number'];
//       if ( height && (typeof Number(height) !== "number") ) return ['Height is not number'];
//       if ( diameter && (typeof Number(diameter) !== "number") ) return ['Diameter is not number'];
//       if ( price && (typeof Number(price) !== "number") ) return ['Price is not number'];
//     }


//     return [undefined, new UpdateProductDto( name, capacity, height, diameter, price )];
//   }
// }

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