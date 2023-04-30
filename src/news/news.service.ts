import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


var count = 0;

@Injectable()
export class NewsService {
  getNews() {
    const NEWS_API_KEY = this.configService.get<string>('NEWS_API_KEY');
    const apiUrl = `https://gnews.io/api/v4/search?apikey=${NEWS_API_KEY}&q=example&lang=en&country=us`;
    return fetch(apiUrl)
  }
  constructor(private readonly configService: ConfigService) { }
  async search(q: string, limit: number, searchin: string) {
    const NEWS_API_KEY = this.configService.get<string>('NEWS_API_KEY')
    count++;
    console.log(q, limit, searchin)
    var apiUrl = `https://gnews.io/api/v4/search?`;
    const queryParams = {
      apikey: NEWS_API_KEY,
      q: q,
      max: limit,
      in: searchin
    }
    const searchParams = new URLSearchParams()
    for (const key in queryParams) {
      if (queryParams[key] != undefined) {
        searchParams.append(key, queryParams[key])
      }
    }
    apiUrl = apiUrl + searchParams.toString()
    console.log(count, apiUrl)

    // throw new Error("test");
    const response = await fetch(apiUrl);
    return response;
  }


}
