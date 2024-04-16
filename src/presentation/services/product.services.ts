import { ProductModel } from "../../data";
import { CreateProductDto, CustomError } from "../../domain";

export class ProductService {
  constructor(

  ) {}

  async createProduct( createProductDto: CreateProductDto ) {
    const productExist = await ProductModel.findOne({ name: createProductDto.name });
    if ( productExist ) throw CustomError.badRequest( 'Product already exists' );

    try {
      const product = new ProductModel({
        ...createProductDto,
      })

      await product.save();

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find()

      // return {
      //   products: products.map( product => ({
      //     id: product.id,
      //     name: product.name,
      //     price: product.price,
      //     description: product.description,
      //   }))
      // }
      
      return products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
      }));
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}