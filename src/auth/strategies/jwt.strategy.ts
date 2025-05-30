
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";

import { user } from "../entities";
import { JwtPayload } from "../interfaces";



@Injectable()  
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( user )
        private readonly userRepository: Repository<user>,

        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ): Promise<user> {
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) throw new UnauthorizedException('Token no valido')
            
        if ( !user.activo ) throw new UnauthorizedException('Usuario inactivo, contacte al administrador');

        return user;
    }

}