import { Router } from 'express';
import { ProductsRoutes } from './product/routes';
import { AuthRoutes } from './auth/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    
    router.use('/auth', AuthRoutes.routes);
    router.use('/products', ProductsRoutes.routes);

    return router;
  }
}