import { ProductModel } from "../../data";
import { CreateProductDto, CustomError } from "../../domain";
import { UpdateProductDto } from "../../domain/dtos/product/update-product.dto";

interface Product {
  id: string;
  name: string;
  capacity: number;
  height: number;
  diameter: number;
  price: number;
}

export class ProductService {
  constructor(

  ) {}

  async createProduct( createProductDto: CreateProductDto ) {
    const productExist = await ProductModel.findOne({
      name: createProductDto.name,
      capacity: createProductDto.capacity,
      height: createProductDto.height,
      diameter: createProductDto.diameter,
      price: createProductDto.price
    });

    if (productExist) {
      throw CustomError.badRequest('A product with exactly the same characteristics already exists.');
    }

    try {
      const product = new ProductModel({
        ...createProductDto,
      })

      await product.save();

      return {
        message: 'Product created successfully',
        createdProduct: {
          id       : product.id,
          name     : product.name,
          capacity : product.capacity,
          height   : product.height,
          diameter : product.diameter,
          price    : product.price,
        }
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find()

      return {
        products: products.map( product => ({
          id       : product.id,
          name     : product.name,
          capacity : product.capacity,
          height   : product.height,
          diameter : product.diameter,
          price    : product.price,
        }))
      }
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async updateProduct( productId: string, updateProductDto: UpdateProductDto ) {
    try {
      const productUpdate = await ProductModel.findByIdAndUpdate(productId, updateProductDto);
      if (!productUpdate) throw CustomError.notFound(`Product with ID "${productId}" was not found`);
      
      return {
        message: `Update product with ${productId}`,
        product:productUpdate
      };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }

  async deleteProduct(productId: string): Promise<{ message: string, deletedProduct: Product }> {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) throw CustomError.notFound(`Product with ID "${productId}" was not found`);
  
      const formattedDeletedProduct: Product = {
        id       : deletedProduct._id.toString(),
        name     : deletedProduct.name,
        capacity : deletedProduct.capacity,
        height   : deletedProduct.height,
        diameter : deletedProduct.diameter,
        price    : deletedProduct.price,
      };
  
      return { message: 'Product deleted successfully', deletedProduct: formattedDeletedProduct };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }
}