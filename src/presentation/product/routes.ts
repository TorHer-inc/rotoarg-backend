import { Router } from 'express';
import { ProductService } from '../services/product.services';
import { ProductsController } from './controller';
import { buildPDF } from './utils/pdfkit';

export class ProductsRoutes {

  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const controller = new ProductsController( productService );

    router.post('/', controller.createProduct);

    router.get('/', controller.getProducts);
    // TODO router.get('/:id', controller.getProducts); 
    router.get('/last-updated', controller.getLastUpdated);
    router.get("/lista-productos-pdf", controller.generatePdf );

    router.delete('/:id', controller.deleteProduct);
    
    router.put('/:id', controller.updateProduct);

    return router;
  }
}