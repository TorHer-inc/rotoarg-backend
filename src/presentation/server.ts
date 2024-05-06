import express, { Router } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from "cors"
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import session from 'express-session';
import { UserModel } from '../data';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    //* Middlewares
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
    this.app.use( cookieParser() );

    // Configuración de CORS
    this.app.use(cors({
      origin         : 'http://localhost:5173',
      credentials    : true,
      methods        : 'GET, POST, PUT, DELETE',
      allowedHeaders : ['Content-Type', 'Authorization', 'Referrer-Policy', 'no-referrer-when-downgrade'],
    }));

    this.app.use(session({
      secret            : 'your-secret-key',
      resave            : false,
      saveUninitialized : true,
    }));

    this.app.use( passport.initialize() );
    this.app.use( passport.session() );

    passport.use(new OAuth2Strategy({
      clientID         : "140589767765-nvms749mlat00o0848v7241j22qj03fc.apps.googleusercontent.com",
      clientSecret     : "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",
      callbackURL      : "http://localhost:3000/auth/google/callback",
      scope            : ["profile", "email"],
    }, 
    async(accessToken, refreshToken, profile, done) => {
      // console.log('profile', profile);
      try {
        let user = await UserModel.findOne({ googleId: profile.id })
        if (!user) {
          user = new UserModel({
            googleId : profile.id,
            name     : profile.displayName,
            email    : profile.emails[0].value,
            image    : profile.photos[0].value,
          });

          await user.save();
        }
        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user: any, done) => {
      done(null, user);
    });

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use( this.routes );
    
    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}