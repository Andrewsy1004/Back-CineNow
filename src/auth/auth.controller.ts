

import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor( private readonly authService: AuthService ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create(createUserDto );
  }

  @Post('registerUser')
  createUsers(@Body() createUserDto: CreateUserDto ) {
    return this.authService.createUsers(createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }

  @Patch('updateInfoUser')
  @Auth()
  UpdateinfoUser(
    @Req() request: Express.Request,
    @GetUser('id') userId: string,
    
    @Body() updateData: UpdateUserDto,
  ) {
    return this.authService.updateInfoUser( userId, updateData );
  }


  @Post('RegisterUser')
  @Auth( ValidRoles.Cajero ,  ValidRoles.Administrador )  
  RegisterUser( @Body() createUserDto: CreateUserDto ) {
    return this.authService.CreateUserByAdminCashier( createUserDto );
  }

  
  @Get('GetLogsUser')
  @Auth( ValidRoles.Administrador )  
  GetLogs( ) {
    return this.authService.getLogsUser();
  }
  
  
  @Get('GetAllUsers')
  @Auth( ValidRoles.Administrador )  
  GetAllUsers( ) {
    return this.authService.getAllUsers();
  }



}
