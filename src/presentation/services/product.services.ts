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
        id       : product.id,
        name     : product.name,
        capacity : product.capacity,
        height   : product.height,
        diameter : product.diameter,
        price    : product.price,
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
        id       : product.id,
        name     : product.name,
        price    : product.price,
        capacity : product.capacity,
        height   : product.height,
        diameter : product.diameter,
      }));
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async deleteProduct( productId: string ) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) throw CustomError.notFound(`Product with ID "${productId}" was not found`);
      
      return deletedProduct;
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }
}