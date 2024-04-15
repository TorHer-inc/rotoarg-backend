import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes {


  static get routes(): Router {
    const router = Router();
    
    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );

    return router;
  }
}