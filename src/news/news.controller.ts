import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NewsService } from './news.service';
import { ApiTags, ApiQuery, ApiResponse, ApiProduces, ApiOperation } from '@nestjs/swagger';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  // Get N news articles
  @Get("search")
  @ApiTags('news')
  @ApiOperation({ summary: 'Get news articles based on keywords in title, description, content' })
  @ApiProduces('application/json')
  @ApiQuery({ name: 'q', required: true, description: 'Search keywords' })
  @ApiQuery({ name: 'max', 
  required: false, 
  type: Number,

  description: 'Max number of articles to return',
  
  
 })
  @ApiQuery({
    name: 'in', required: false,
    description: 'The fields to restrict your q search to.',
    enum: ['title', 'description', 'content'],
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
