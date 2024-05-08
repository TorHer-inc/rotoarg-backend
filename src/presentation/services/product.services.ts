import mongoose from "mongoose";
import { ProductModel } from "../../data";
import { CreateProductDto, UpdateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {
  constructor(

  ) {}

  async createProduct( createProductDto: CreateProductDto ) {
    const productExist = await ProductModel.findOne({
      name     : createProductDto.name,
      capacity : createProductDto.capacity,
      height   : createProductDto.height,
      diameter : createProductDto.diameter,
      price    : createProductDto.price
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

  async getAllProducts() {
    try {
      const products = await ProductModel.find()

      return {
        products
      }
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getPaginatedProducts ( paginationDto: PaginationDto ) {
    const { page, limit } = paginationDto;

    try {
      const [ total, products ] = await Promise.all( [
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip( ( page - 1 ) * limit )
          .limit( limit )
      ]);

      const totalPages = Math.ceil(total / limit);

      if (page > totalPages) {
        throw CustomError.badRequest('La página solicitada no existe');
      }

      return {
        page       : page,
        limit      : limit,
        total      : total,
        totalPages : totalPages,
        next       : (total > page * limit) ? `/products/paginated?page=${page + 1}&limit=${limit}` : null,
        prev       : (page - 1 > 0) ? `/products/paginated?page=${ (page - 1) }&limit=${ limit }`   : null,
        products   : products.map( product => ({
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

  async getProductById(productId: string) {
    try {
      const validId = mongoose.isValidObjectId(productId);
  
      if (!validId) {
        throw CustomError.notFound(`Invalid product ID: ${productId}`);
      }
  
      const product = await ProductModel.findById(productId);
  
      if (!product) {
        throw CustomError.notFound(`Product with ID "${productId}" was not found`);
      }
  
      return {
        product
      };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer('Internal Server Error');
    }
  }

  // Sirve para saber la fecha de actualizacion de los ultimos productos CREATE y PUT
  async getLastUpdated() {
    try {
      const lastProduct = await ProductModel.findOne().sort({ updatedAt: -1 });
      // Utilizar el campo `updatedAt` para registrar la última actualización de cualquier producto
      if (lastProduct) {
        return lastProduct.updatedAt;
      } else {
        return null; // Si no hay productos en la base de datos
      }
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
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

  // Actualizar la fecha de última actualización cuando se DELETE un producto
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