import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NewsService } from './news.service';
import { ApiTags, ApiQuery, ApiResponse, ApiProduces, ApiOperation } from '@nestjs/swagger';


@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  // Get N news articles
  @Get("search")
  @ApiOperation({ summary: 'Get fetching N news articles, finding a news article with a specific title or author, and searching by keywords' })
  @ApiProduces('application/json')
  @ApiQuery({ name: 'q', required: true, description: 'Search keywords. Query syntax can be found at https://gnews.io/docs/v4#query-syntax' })
  @ApiQuery({ name: 'max', 
  required: false, 
  type: Number,

  description: 'Max number of articles to return',
  
  
 })
  @ApiQuery({
    name: 'in', required: false,
    description: "Search in specific fields. Possible values: title, description, content. Multiple values can be used by separating them with a comma.",
    // enum: ['title', 'description', 'content'],
  })
  @ApiResponse({ status: 200, description: 'List of news articles' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000) // 10 seconds
  async getNews(
    @Query('q') q: string,
    @Query('max') limit: number,
    @Query('in') searchin: string,
  ) {
    return await this.newsService.getNews(q, limit, searchin);
  }

}
