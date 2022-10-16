import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { CurrenUserGuard } from './guards/current-user.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) { 
    const { user, access_token} = await this.authService.login(req.user);

    res.cookie("IsAuthenticated", true, {
      maxAge: 2 * 60 * 60 * 1000
    })

    res.cookie("Authenticated", access_token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000
    })

    return res.send({ success: true, user});
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) { 
    const { user, access_token} = await this.authService.login(req.user);

    res.clearCookie('Authenticated');

    res.clearCookie('IsAuthenticated');


    return res.status(200).send({ success: true});
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(CurrenUserGuard)
  @Get('status')
  authStatus(@CurrentUser() user: User) {
    return {status: !!user, user};
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
