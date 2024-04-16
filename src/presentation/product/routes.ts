import { Router } from 'express';
import { ProductService } from '../services/product.services';
import { ProductsController } from './controller';

export class ProductsRoutes {

  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const controller = new ProductsController( productService );

    router.post('/', controller.createProduct);
    router.get('/', controller.getProducts);
    // router.get('/:id', controller.getProducts);
    router.delete('/:id', controller.deleteProduct);
    // router.put('/:id', controller.getProducts);

    return router;
  }
  
}