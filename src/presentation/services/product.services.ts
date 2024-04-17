import mongoose from "mongoose";
import { ProductModel } from "../../data";
import { CreateProductDto, UpdateProductDto, CustomError } from "../../domain";

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
      const createdProduct = new ProductModel({
        ...createProductDto,
      })

      await createdProduct.save();

      return {
        message: 'Product created successfully',
        createdProduct,
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find()

      return {
        products
      }
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // ---- Codigo Ale ---- // 
  // async updateProduct( productId: string, updateProductDto: UpdateProductDto ) {
  //   try {
  //     const productUpdate = await ProductModel.findByIdAndUpdate(productId, updateProductDto);
  //     if (!productUpdate) throw CustomError.notFound(`Product with ID "${productId}" was not found`);
      
  //     return {
  //       message: `Update product with ${productId}`,
  //       updatedProduct: productUpdate
  //     };
  //   } catch (error) {
  //     throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
  //   }
  // }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    try {
      const { id, ...updateData } = updateProductDto.values;
      
      const validId = mongoose.isValidObjectId(productId);
      
      if (!validId) {
        throw CustomError.notFound(`Invalid product ID: ${productId}`);
      }
      
      const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });

      if (!updatedProduct) {
        throw CustomError.notFound(`Product with ID "${productId}" was not found`);
      }

      return {
        message: `Product updated successfully`,
        updatedProduct,
      };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }

  // async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
  //   try {
  //     const { id, ...updateData } = updateProductDto.values;
  
  //     const validId = mongoose.Types.ObjectId.isValid(productId);
  //     const validId = mongoose.isValidObjectId(productId);
  
  //     if (!validId) {
  //       throw CustomError.notFound(`Product with ID "${productId}" was not found`);
  //     }
  
  //     const product = await ProductModel.findById(productId);
  
  //     if (!product) {
  //       throw CustomError.notFound(`Product not found`);
  //     }
  
  //     // Aplicar las actualizaciones al producto encontrado
  //     Object.assign(product, updateData);
  
  //     // Guardar el producto actualizado
  //     await product.save();
  
  //     return {
  //       message: `Product updated successfully`,
  //       updatedProduct: product,
  //     };
  //   } catch (error) {
  //     throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
  //   }
  // }

  async deleteProduct(productId: string) {
    const validId = mongoose.isValidObjectId(productId);
      
    if (!validId) {
      throw CustomError.notFound(`Invalid product ID: ${productId}`);
    }

    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) throw CustomError.notFound(`Product with ID "${productId}" was not found`);
  
      return { 
        message: 'Product deleted successfully', 
        deletedProduct,
      };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }
}