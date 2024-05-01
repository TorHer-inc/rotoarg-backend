import { Request, Response } from "express";
import { CustomError, CreateProductDto, UpdateProductDto } from "../../domain";
import { buildPDF } from "./utils/pdfkit";
import { ProductService } from "../services";

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

  getLastUpdated = (req: Request, res: Response) => {
    this.productService.getLastUpdated()
      .then((lastUpdated: Date | null) => res.status(200).json({ lastUpdated }))
      .catch((error: Error) => this.handleError(error, res));
  };

  generatePdf = async (req: Request, res: Response) => {
    try {
      // Obtener los productos del servidor
      const products = await this.productService.getProducts();

      // Establecer Headers
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=lista-productos.pdf",
      });

      // Llamar al método `buildPDF` pasando los productos
      buildPDF(
        products.products,
        (data: any) => stream.write(data),
        () => stream.end()
      );

    } catch (error) {
      // Manejar cualquier error que ocurra durante la obtención de productos o la generación de PDF
      console.error("Error generating PDF:", error);
      res.status(500).send("Error generating PDF");
    }
  };
}