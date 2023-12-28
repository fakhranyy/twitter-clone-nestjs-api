import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Technical article',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'The description of the article',
    example: 'this is article about an specifically subject which is...'
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'The body of the whole article',
  })
  @IsNotEmpty()
  @IsString()
  readonly body: string;

  // @ApiProperty({ 
  //   description: 'unique title of the article',
  //     })
  // @IsString()
  // readonly slug: string;

  readonly tagList?: string[]; // the ( ? ) after field name makes it not mandatory
}
