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

  // Sirve para saber la fecha de actualizacion de los ultimso producos CREADOS y ACTUALIZADOS
  async getLastUpdated() {
    try {
      const lastProduct = await ProductModel.findOne().sort({ updatedAt: -1 });
      // Suponiendo que estás usando el campo `updatedAt` para registrar la última actualización de cualquier producto
      if (lastProduct) {
        return lastProduct.updatedAt;
      } else {
        return null; // Si no hay productos en la base de datos
      }
    } catch (error) {
      throw error;
    }
  }


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

  // Actualizar la fecha de última actualización cuando se BORRA un producto
  async updateLastUpdated() {
    try {
      const currentDate = new Date();
      await ProductModel.updateMany({}, { $set: { updatedAt: currentDate } });
    } catch (error) {
      throw CustomError.internalServer('Error updating last updated date');
    }
  }

  
  async deleteProduct(productId: string) {
    const validId = mongoose.isValidObjectId(productId);
      
    if (!validId) {
      throw CustomError.notFound(`Invalid product ID: ${productId}`);
    }

    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) throw CustomError.notFound(`Product with ID "${productId}" was not found`);

      // Actualizar la fecha de última actualización
      await this.updateLastUpdated();
  
      return { 
        message: 'Product deleted successfully', 
        deletedProduct,
      };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }
}