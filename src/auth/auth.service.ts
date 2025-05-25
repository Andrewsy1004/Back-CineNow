
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { In, Not, Raw, Repository } from 'typeorm';

import { LogUsers, user } from './entities';
import { JwtPayload } from './interfaces';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';


@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');
    
    constructor(
        @InjectRepository(user)
        private readonly userRepository: Repository<user>,
        
        @InjectRepository(LogUsers)
        private readonly logRepository: Repository<LogUsers>,

        private readonly jwtService: JwtService,
      ) {}

    
      async create( createUserDto: CreateUserDto) {
    
        try {
    
          const { contrasena, ...userData } = createUserDto;
          
          const user = this.userRepository.create({
            ...userData,
            contrasena: bcrypt.hashSync( contrasena, 10 ),
          });
    
          await this.userRepository.save( user )
          delete user.contrasena;
    
          return {
            ...user,
            token: this.getJwtToken({ id: user.id })
          };
    
        } catch (error) {
          this.handleDBErrors(error);
        }
      }
      
      async login( loginUserDto: LoginUserDto ) {

        const { contrasena , correo } = loginUserDto;
    
        const user = await this.userRepository.findOne({
          where: { correo },
          select: { correo: true, contrasena: true, id: true, nombre: true, apellido: true, roles: true, FotoPerfil: true, NumeroCuenta: true }, 
        });
    
        if ( !user ) throw new UnauthorizedException(' Las credenciales no son validas ');
          
        if ( !bcrypt.compareSync(  contrasena, user.contrasena ) ) throw new UnauthorizedException(' Las credenciales no son validas ');

        if( user.activo === false ) throw new UnauthorizedException(' El usuario no esta activo, por favor contacte al administrador ');
        
        delete user.contrasena;

        // Auditoria 

        const log = this.logRepository.create({
          user: { id: user.id },
          fecha: new Date().toLocaleDateString(),
          hora:  new Date().toLocaleTimeString(),
        });
       
        
        await this.logRepository.save( log )
        await this.logRepository.save( log )

        return {
          ...user,
          token: this.getJwtToken({ id: user.id })
        };
      }
      
      async updateInfoUser( userId: string, updateData: UpdateUserDto ) {
        try {
    
          const user = await this.userRepository.preload({
            id: userId,
            ...updateData,
          });
    
          if (!user) throw new BadRequestException('Usuario no encontrado');
    
          await this.userRepository.save(user);
           
          return {
            msg: 'Usuario actualizado correctamente',
          };
          
        } catch (error) {
          if (error instanceof BadRequestException) throw error;
          this.handleDBErrors(error);
        }
      }
      
      async CreateUserByAdminCashier(createUserDto: CreateUserDto) {
        try {
          const { correo, contrasena, ...userData } = createUserDto;
      
          let user = await this.userRepository.findOneBy({ correo });
      
          if (user) {
            delete user.contrasena; 
            return user;
          }
      
          user = await this.create(createUserDto); 
          return user;
          
        } catch (error) {
          if (error instanceof BadRequestException) throw error;
          this.handleDBErrors(error);
        }
      }


      async createUsers( createUserDto: CreateUserDto) {
    
        try {
    
          const { contrasena, ...userData  } = createUserDto;
          
          // Verificar si el correo ya existe
          const existingUser = await this.userRepository.findOneBy({ correo: userData.correo });

          if (existingUser) {
            delete existingUser.contrasena; 
            return {
              ...existingUser,
              token : this.getJwtToken({ id: existingUser.id })
            };
          }

          // Crear el nuevo usuario
          const user = this.userRepository.create({
            ...userData,
            contrasena: bcrypt.hashSync( contrasena, 10 ),
          });
    
          await this.userRepository.save( user )
          delete user.contrasena;
    
          return {
            ...user,
            token: this.getJwtToken({ id: user.id })
          };
          
    
        } catch (error) {
           if (error instanceof BadRequestException) throw error;
           this.handleDBErrors(error);
        }
      }
      
      async getLogsUser() {
        try {

          const logs = await this.logRepository.find( {
            relations: {
              user: true,
            },
          });

          const formattedLogs = logs.map((log) => ({
            ...log,
            user: {
              nombre: log.user.nombre,
              apellido: log.user.apellido,
              correo: log.user.correo,
            },
          }));
          
          return formattedLogs;
          
        } catch (error) {
          this.handleDBErrors(error); 
        }
      }

      async getAllUsers () {
        try {
          
          const users = await this.userRepository.find({
            where: {
             roles: Raw((alias) => `${alias} && ARRAY['Administrador']::text[] = false`),
            },
          });

          return users;
        
        } catch (error) {
          this.handleDBErrors(error); 
        }
      }

    
    private getJwtToken( payload: JwtPayload ) {
       const token = this.jwtService.sign( payload );
       return token;
    }

    async RevalidateToken(  user: user ) {
      try {
  
        return {
           ...user,
           token : this.getJwtToken({ id: user.id })
        }
          
      } catch (error) {
        if ( error instanceof BadRequestException ) throw error;
        this.handleDBErrors(error);
      }
    }
   
     
    private handleDBErrors( error: any ): never {
       if ( error.code === '23505' ) throw new BadRequestException( error.detail );
       this.logger.error(error);
       throw new InternalServerErrorException('Please check server logs');
    }


    async getAdminUser() {
      return this.userRepository.createQueryBuilder('usuario')
        .where('usuario.roles @> ARRAY[:rol]', { rol: 'Administrador' })
        .getOne();
    }
    
    
    
}
