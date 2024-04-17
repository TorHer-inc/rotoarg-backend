import { Request, Response } from "express";
import { ProductService } from '../services/product.services';
import { CreateProductDto, CustomError } from "../../domain";
import { UpdateProductDto } from "../../domain/dtos/product/update-product.dto";

export class ProductsController {

  constructor(
    private readonly productService: ProductService,
  ) {}

  private handleError = (error: unknown , res: Response) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json({ error: error.message })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }

  createProduct = ( req: Request, res: Response ) => {
    const [ error, createProductDto ] = CreateProductDto.create( req.body );
    if ( error ) return res.status(400).json({ error });

    this.productService.createProduct( createProductDto! )
      .then( product => res.status(201).json( product ) )
      .catch( error => this.handleError( error, res ) ); 
  };

  getProducts = ( req: Request, res: Response ) => {
    this.productService.getProducts()
      .then( products => res.json( products ) )
      .catch( error => this.handleError( error, res ) ); 
  };

  updateProduct = ( req: Request, res: Response ) => {
    const productId = req.params.id;

    const [ error, updateProductDto ] = UpdateProductDto.create( req.body );
    if ( error ) return res.status(400).json({ error });

    this.productService.updateProduct( productId, updateProductDto! )
      .then( product => res.status(200).json( product ) )
      .catch( error => this.handleError( error, res ) ); 
  };

  deleteProduct = ( req: Request, res: Response ) => {
    const productId = req.params.id;

    this.productService.deleteProduct( productId )
      .then(( deletedProduct ) => res.status(200).json( deletedProduct ) )
      .catch( error => this.handleError( error, res ) ); 
  };
}