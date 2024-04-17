import mongoose from "mongoose";
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


  // async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
  //   try {
  //     const { id, ...updateData } = updateProductDto.values;
      
  //     const validId = mongoose.Types.ObjectId.isValid(productId);
      
  //     if (!validId) {
  //       throw CustomError.notFound(`Product with ID "${productId}" was not found`);
  //     }
      
  //     const productUpdate = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });

  //     if (!productUpdate) {
  //       throw CustomError.notFound(`Product with ID "${productId}" was not found`);
  //     }

  //     const updatedProduct = {
  //       id: productUpdate._id.toString(),
  //       name: productUpdate.name,
  //       capacity: productUpdate.capacity,
  //       height: productUpdate.height,
  //       diameter: productUpdate.diameter,
  //       price: productUpdate.price,
  //     };
      
  //     return {
  //       message: `Product updated successfully`,
  //       updatedProduct: updatedProduct,
  //     };
  //   } catch (error) {
  //     throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
  //   }
  // }


  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    try {
      const { id, ...updateData } = updateProductDto.values;
  
      const validId = mongoose.Types.ObjectId.isValid(productId);
  
      if (!validId) {
        throw CustomError.notFound(`Product with ID "${productId}" was not found`);
      }
  
      const product = await ProductModel.findById(productId);
  
      if (!product) {
        throw CustomError.notFound(`Product not found`);
      }
  
      // Aplicar las actualizaciones al producto encontrado
      Object.assign(product, updateData);
  
      // Guardar el producto actualizado
      await product.save();
  
      const updatedProduct = {
        id: product._id.toString(),
        name: product.name,
        capacity: product.capacity,
        height: product.height,
        diameter: product.diameter,
        price: product.price,
      };
  
      return {
        message: `Product updated successfully`,
        updatedProduct: updatedProduct,
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