import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LazyModuleLoader } from '@nestjs/core';
import { CommentModule } from './comment.module';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentSrv: CommentService,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:slug')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
    @Param(':slug') slug: string,
  ): Promise<Comment> {
    const moduleRef = await this.lazyModuleLoader.load(() => CommentModule);
    const lazySrv = moduleRef.get(CommentService);
    return lazySrv.createComment(createCommentDto, req, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(@Request() req, @Param('commentId') commentId: number) {
    const moduleRef = await this.lazyModuleLoader.load(() => CommentModule);
    const lazySrv = moduleRef.get(CommentService);
    return lazySrv.deleteComment(commentId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async editComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    const moduleRef = await this.lazyModuleLoader.load(() => CommentModule);
    const lazySrv = moduleRef.get(CommentService);
    return lazySrv.editComment(commentId, updateCommentDto, req);
  }
}
