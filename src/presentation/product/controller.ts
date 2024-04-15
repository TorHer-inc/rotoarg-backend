import { Request, Response } from "express"
import { ProductService } from "../services/product.services"

export class ProductsController {

  // DI

  constructor(
    private readonly categoryService: ProductService,
  ) {}

  getProducts = async ( req: Request, res: Response ) => {
    return res.json('Ruta products up')
  };
}