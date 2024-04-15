import { Router } from 'express';
import { ProductService } from '../services/product.services';
import { ProductsController } from './controller';

export class ProductsRoutes {

  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const controller = new ProductsController( productService );

    router.get('/', controller.getProducts);

    return router;
  }
  
}