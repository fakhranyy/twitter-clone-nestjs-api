import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('tags')
@ApiTags('Tags Apis')
export class TagController {
  constructor(private readonly tagSrv: TagService) {}
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagSrv.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
