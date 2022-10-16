import { IsString, IsInt, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    mainImageUrl: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsInt()
    category: Category;
}
