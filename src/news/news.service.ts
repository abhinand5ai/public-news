import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

var count = 0;
@Injectable()
export class NewsService {
  constructor(private readonly configService: ConfigService) { }
  async getNews( q: string, limit: number, searchin: string) {
    const NEWS_API_KEY = this.configService.get<string>('NEWS_API_KEY');
    count++;
    console.log(count)
    console.log(q, limit, searchin)
    var apiUrl = `https://gnews.io/api/v4/search?apikey=${NEWS_API_KEY}`;
    if (q) {
      apiUrl = apiUrl.concat(`&q=${q}`)
    }
    if (limit) {
      apiUrl = apiUrl.concat(`&limit=${limit}`)
    }
    if (searchin) {
      apiUrl = apiUrl.concat(`&in=${searchin}`)
    }
    apiUrl = encodeURI(apiUrl)
    console.log(apiUrl)
    const res = await fetch(apiUrl)
    const data = await res.json()
    return data
  }


}
