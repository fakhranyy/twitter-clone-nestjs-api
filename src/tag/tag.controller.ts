import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { LazyModuleLoader } from '@nestjs/core';
import { TagModule } from './tag.module';

@Controller('tags')
@ApiTags('Tags Apis')
export class TagController {
  // constructor(private readonly tagSrv: TagService) {}
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  @ApiAcceptedResponse({ description: 'Find all tags'})
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const moduleRef = this.lazyModuleLoader.load(() => TagModule);
    const lazySrv = (await moduleRef).get(TagService);
    const tags = await lazySrv.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
