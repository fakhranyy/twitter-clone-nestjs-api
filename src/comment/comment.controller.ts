import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentSrv: CommentService) {}

  @Post(':username/:slug')
  // @UseGuards(AuthGuard)
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    // @Userdeco('id') currentUserId: User,
    @Param('username') username: string,
    @Param(':slug') slug: string,
  ): Promise<Comment> {
    return await this.commentSrv.createComment(
      createCommentDto,
      username,
      slug,
    );
  }

  @Delete(':commentId')
  // @UseGuards(AuthGuard)
  async deleteComment(
    @Param('commentId') commentId: number,
  ) {
    return await this.commentSrv.deleteComment(commentId)
  }

  @Patch(':commentId')
  // @UseGuards(AuthGuard)
  async editComment () {}
}
