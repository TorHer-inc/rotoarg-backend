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
    router.get('/last-updated', controller.getLastUpdated);

    // router.get('/', controller.generatePDF);
    router.get("/lista", async (req, res) => {
      try {
        // Obtener los productos del servidor
        const products = await productService.getProducts();
    
        // Llamar al método `buildPDF` pasando los productos
        const stream = res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=lista-productos.pdf",
        });
    
        buildPDF(
          products.products, // Accede a los productos dentro del objeto retornado por productService.getProducts()
          (data: any) => stream.write(data),
          () => stream.end()
        );
      } catch (error) {
        // Manejar cualquier error que ocurra durante la obtención de productos o la generación de PDF
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
      }
    });


    // TODO router.get('/:id', controller.getProducts); 
    router.delete('/:id', controller.deleteProduct);
    router.put('/:id', controller.updateProduct);

    return router;
  }
  
}