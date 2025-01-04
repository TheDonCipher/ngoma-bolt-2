import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across all content types' })
  async search(@Query(ValidationPipe) query: SearchQueryDto) {
    const { q, type, page, limit, ...filters } = query;
    
    return this.searchService.search(
      type,
      q,
      filters,
      page,
      limit,
    );
  }
}
