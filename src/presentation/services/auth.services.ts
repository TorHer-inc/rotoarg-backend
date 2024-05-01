import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, LoginUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.services';

export class AuthService {

  constructor(
    private readonly emailService: EmailService, 
  ) {}

  public async registerUser( registerUserDto: RegisterUserDto ) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash( registerUserDto.password );
      
      await user.save();

      // Email de confirmación
      // this.emailService.sendEmail(); Seria como mandar esto, pero yo lo estoy mandando a traves de sendEmailValidationLink, que utiliza emailService
      this.sendEmailValidationLink( user.email )

      const { password, ...userEntity } = UserEntity.fromObject(user);

      // JWT <---- para mantener la autenticación del usuario
      const token = await JwtAdapter.generateToken({ id: user.id });
      if ( !token ) throw CustomError.internalServer('Error while creating JWT');

      return { 
        user: userEntity, 
        token: token,
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }

  }

  public async loginUser( loginUserDto: LoginUserDto ) {
    // Verificamos si el user existe por el correo electronico
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    // Verificamos si matchean las passwords, la password que recibo de mi Dto con la password que tengo hasheada en mi modelo
    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');

    // Quito el password asi no se muestra aunque este hasheada, y envio el userEntity
    const { password, ...userEntity} = UserEntity.fromObject( user );
    
    const token = await JwtAdapter.generateToken({ id: user.id });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity, 
      token: token,
    }
  }

  public async verifySession(token: string) {
    const userToken = await JwtAdapter.validateToken<{ id: string }>(token);
    if (!userToken || !userToken.id) throw CustomError.unauthorized('Invalid session token');
    
    const userFound = await UserModel.findById(userToken.id);
    if (!userFound) throw CustomError.unauthorized('User not found');

    const { password, ...userEntity} = UserEntity.fromObject( userFound );

    return userEntity;
  }

  private sendEmailValidationLink = async( email: string ) => {

    const token = await JwtAdapter.generateToken({ email });
    if ( !token ) throw CustomError.internalServer('Error getting token');

    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${ link }">Validate your email: ${ email }</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return true;
  }

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if ( !payload ) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if ( !email ) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if ( !user ) throw CustomError.internalServer('Email not exists');

    user.emailValidated = true;
    await user.save();

    return true;
  }
}