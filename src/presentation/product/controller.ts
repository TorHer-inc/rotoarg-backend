import { Request, Response } from "express"
import { ProductService } from '../services/product.services';
import { CreateProductDto, CustomError } from "../../domain";

export class ProductsController {

  // DI

  constructor(
    private readonly productService: ProductService,
  ) {}

  private handleError = (error: unknown , res: Response) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json({ error: error.message })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }

  createProduct = async ( req: Request, res: Response ) => {
    const [ error, createProductDto ] = CreateProductDto.create( req.body );
    if ( error ) return res.status(400).json({ error });

    this.productService.createProduct( createProductDto! )
      .then( product => res.status(201).json( product ) )
      .catch( error => this.handleError( error, res ) ); 
  };

  getProducts = async ( req: Request, res: Response ) => {
    this.productService.getProducts()
      .then( products => res.json( products ) )
      .catch( error => this.handleError( error, res ) ); 
  };
}