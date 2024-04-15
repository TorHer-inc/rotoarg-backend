import { Router } from 'express';
import { AuthController } from './controller';

export class AuthRoutes {


  static get routes(): Router {
    const router = Router();
    
    router.get('/',);

    return router;
  }
}