import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    console.log("this is the user: ", user)
    const post = new Post();
    Object.assign(post, createPostDto);
    post.user = user;

    const postEntity: Post  = this.postsRepository.create(post);

    return this.postsRepository.save(post);
  }

  findAll(query?: string): Promise<Post[]>{
    return this.postsRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if(!post){
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND)
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOneBy({ id });
    if(!post){
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND)
    }
    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number): Promise<void>  {
    const post  = this.postsRepository.findOneBy({id});

    if(!post){
      throw new BadRequestException('Post not found')
    }

    await this.postsRepository.delete(id);

    // return { success: true, post}
  }
}
