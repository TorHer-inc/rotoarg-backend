import { Router } from 'express';
import { ProductsController } from './products.controller';

export class ProductsRoutes {


  static get routes(): Router {
    const router = Router();
    
    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );
    router.use('/auth/',);

    return router;
  }
}