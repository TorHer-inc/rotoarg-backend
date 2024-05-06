import { Request, Response, Router } from 'express';
import { AuthController } from './controller';
import { JwtAdapter, envs } from '../../config';
import { AuthService, EmailService } from '../services';
import passport from 'passport';

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
    const controller = new AuthController(authService);

    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);
    router.get("/verify", controller.verifySession);

    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/callback', passport.authenticate('google', { 
      successRedirect: 'http://localhost:5173',
      failureRedirect: 'http://localhost:5173',
    }),
    function(req, res) {
      res.redirect('http://localhost:5173');
    });

    router.get('/googlelogin/sucess', async( req, res ) => {
      // console.log("request", req.user);

      if (req.user) {
        res.status(200).json({ message: "User login", user: req.user })
      } else {
        res.status(400).json({ message: "Not Authorized" })
      }
    });

    router.get("/googlelogout", ( req,res,next ) => {
      req.logout(function( err ){
        if (err) { return next( err ) }
        res.redirect("http://localhost:5173");
      })
    })
    
    return router;
  }
}