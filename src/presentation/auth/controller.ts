import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services";

export class AuthController {
  constructor (
    public readonly authService: AuthService
  ) {}

  private handleError = (error: unknown , res: Response) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json({ error: error.message })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }

  registerUser = (req: Request, res: Response) => {
    this.authService.registerUser(req.body)
      .then(user => {
        res.cookie('session', user.token, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
          maxAge: 3600000,
          // maxAge: 30000,
        });
        res.json(user);
      })
      .catch(error => {
        this.handleError(error, res);
      });
  }

  loginUser = (req: Request, res: Response) => {
    this.authService.loginUser(req.body)
      .then(user => {
        res.cookie('session', user.token, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
          maxAge: 3600000,
          // maxAge: 30000,
        });
        res.json(user);
      })
      .catch(error => {
        this.handleError(error, res);
      });
  }

  verifySession = async (req: Request, res: Response) => {
    const { session } = req.cookies;
    if (!session) return res.sendStatus(401);
  
    this.authService.verifySession(session)
      .then( user =>  res.json(user) )
      .catch( error => this.handleError(error, res) );
  }

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    
    this.authService.validateEmail( token )
      .then( () => res.json('Email was validated properly') )
      .catch( error => this.handleError(error, res) );
  }
}