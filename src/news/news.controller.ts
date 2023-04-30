import { Controller, Get, HttpException, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NewsService } from './news.service';
import { ApiTags, ApiQuery, ApiResponse, ApiProduces, ApiOperation } from '@nestjs/swagger';


@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }


  @Get("")
  @ApiOperation({ summary: 'Fetches N news articles' })
  @ApiProduces('application/json')
  @ApiQuery({ name: 'max', required: false, type: Number, description: 'This parameter allows you to specify the number of news articles returned by the API. The minimum value of this parameter is 1. The default and the maximum value is 10' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000) // 10 seconds
  @ApiResponse({ status: 200, description: 'List of news articles' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNews(@Query('max') limit: number,) {
    const resp = await this.newsService.getNews(limit);
    if(resp.status==200){
      const data = await resp.json();
      return data;
    }else{
      const data = await resp.json();
      throw new HttpException(data, resp.status);
    }

  }


  @Get("search/title")
  @ApiOperation({ summary: 'Fetches N news articles, finding a news articles searching by title' })
  @ApiQuery({ name: 'q', required: true, description: 'This parameter allows you to specify your search keywords to find in the news titles  Query syntax can be found at https://gnews.io/docs/v4#query-syntax' })

  @ApiQuery({ name: 'max', required: false, type: Number, description: 'This parameter allows you to specify the number of news articles returned by the API. The minimum value of this parameter is 1. The default and the maximum value is 10' })
  @ApiProduces('application/json')
  @ApiResponse({ status: 200, description: 'List of news articles' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000) // 10 seconds

  async searchTitle(
    @Query('q') q: string,
    @Query('max') limit: number,
  ) {
    const resp = await this.newsService.search(q, limit, "title");
    const data = await resp.json();
    if (resp.status == 200) {
      return data;
    } else {
      throw new HttpException(data, resp.status);
    }
  }

  // Get N news articles
  @Get("search")
  @ApiOperation({ summary: 'Fetches N news articles, finding a news articles searching by keywords' })
  @ApiProduces('application/json')
  @ApiQuery({ name: 'q', required: true, description: 'This parameter allows you to specify your search keywords to find the news articles you are looking for. The keywords will be used to return the most relevant articles. It is possible to use logical operators with keywords. Query syntax can be found at https://gnews.io/docs/v4#query-syntax' })
  @ApiQuery({
    name: 'max',
    required: false,
    type: Number,

    description: 'This parameter allows you to specify the number of news articles returned by the API. The minimum value of this parameter is 1 and the maximum value is 10',


  })
  @ApiQuery({
    name: 'in', required: false,
    description: "This parameter allows you to choose in which attributes the keywords are searched. The attributes that can be set are title, description and content. It is possible to combine several attributes by separating them with a comma. e.g. title,description",

  })
  @ApiResponse({ status: 200, description: 'List of news articles' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'max', required: false, type: Number, description: 'This parameter allows you to specify the number of news articles returned by the API. The minimum value of this parameter is 1. The default and the maximum value is 10' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000) // 10 seconds
  async search(
    @Query('q') q: string,
    @Query('max') limit: number,
    @Query('in') searchin: string,
  ) {
    const resp = await this.newsService.search(q, limit, searchin);
    const data = await resp.json();
    if (resp.status == 200) {
      return data;
    } else {
      throw new HttpException(data, resp.status);
    }
  }



}
