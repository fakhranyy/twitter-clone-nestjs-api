import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentSrv: CommentService) {}

  @Post(':username/:slug')
  @UseGuards(AuthGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    // @Userdeco('id') currentUserId: User,
    @Param('username') username: string,
    @Param(':slug') slug: string,
  ): Promise<Comment> {
    return await this.commentSrv.createComment(createCommentDto, username, slug);
  }
}
 