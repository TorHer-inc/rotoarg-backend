import { Request, Response, Router } from 'express';
import { AuthController } from './controller';
import { envs } from '../../config';
import { AuthService, EmailService } from '../services';

export class AuthRoutes {
  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      // envs.SEND_EMAIL,
    );
    
    const authService = new AuthService( emailService );

    // Instancia de mi controlador
    const controller = new AuthController(authService);
    
    // Definir las rutas
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);
    router.get("/verify", controller.verifySession);

    return router;
  }
}