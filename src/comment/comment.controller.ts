import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Userdeco } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':slug')
  @UseGuards(AuthGuard)
  create(
    @Userdeco() currentUser: User,
    @Body('comment') createCommentDto: CreateCommentDto,
    @Param('slug') slug: string,
  ) {
    return this.commentService.createComment(currentUser ,createCommentDto, slug);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
