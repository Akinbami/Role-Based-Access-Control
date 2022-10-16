import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseInterceptors, ClassSerializerInterceptor, ValidationPipe, Req, Query, UploadedFile, ParseFilePipe, BadRequestException, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request, Response } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('post')
@UseGuards(RolesGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'create',
    resource: 'post'
  })
  @UsePipes(ValidationPipe)
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postService.create(createPostDto, req.user as User);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'post'
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'post'
  })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        const  file_arr = file.originalname.split('.');
        const name = file_arr[0];
        const fileExtention = file_arr[file_arr.length - 1];
        const newFilename = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtention;

        callback(null, newFilename);
      }
    }),
    fileFilter(req, file, callback) {
      if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return callback(null, false);
      }

      return callback(null, true);

    },
  }))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if(!file){
      throw new BadRequestException("File is not an image.")
    }
    const response = {
      filepath: `http://localhost:3000/post/pictures/${file.filename}`
    }
    return response;
  }

  @Get('pictures/:filename')
  getPictures(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, {root: './uploads'})
  }
}
