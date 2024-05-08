import { Router } from 'express';
import { ProductsController } from './controller';
import { ProductService } from '../services';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class ProductsRoutes {

  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const controller = new ProductsController( productService );

    router.post('/', [AuthMiddleware.validateJWT], controller.createProduct);
    
    router.get('/all', controller.getAllProducts);
    router.get('/paginated', controller.getPaginatedProducts);
    router.get('/:id', controller.getProductById);
    router.get('/last-updated', controller.getLastUpdated);
    router.get("/lista-productos-pdf", controller.generatePdf );

    router.delete('/:id', controller.deleteProduct);
    
    router.put('/:id', controller.updateProduct);

    return router;
  }
}