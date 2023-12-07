import {
  Controller,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentSrv: CommentService) {}

  @Post(':slug')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Userdeco() currentUserId: User,
    @Param(':slug') slug: string,
  ): Promise<Comment> {
    return await this.commentSrv.createComment(createCommentDto, currentUserId, slug);
  }
}
 