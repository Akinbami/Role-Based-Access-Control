import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({username});
    console.log("user on validation: ",user)
    if (user && await bcrypt.compare(pass,user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // const payload = { username: user.username, sub: user.id };
    return {
      user,
      access_token: await this.jwtService.signAsync(user),
    };
  }

  async create(createAuthDto: CreateUserDto) {
    const {username, email} = createAuthDto

    let user_exist = await this.usersRepository.find({where: {username: username, email: email}})
    if(user_exist){
      throw new BadRequestException("Email or username is already choosen, please choose a new one.")
    }
    const user = new User();
    Object.assign(user, createAuthDto);

    const userEntity: User  = this.usersRepository.create(user);

    return this.usersRepository.save(user);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
