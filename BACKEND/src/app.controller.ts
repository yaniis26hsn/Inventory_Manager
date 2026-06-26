import { Body, Controller, Get , Param, Post, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly aappService: AppService) {}

  @Get("/hello")
  getHello(): string {
    return this.aappService.getHello();
  }
  @Get()
   getman(): string {
    return this.aappService.getHelloWld() ;
  }
  @Post("/wecomeTo")
   getit(@Body() query , @Req() req , @Res() res): string{
    
    return this.aappService.sayWelcome(query.name ,query.age) ;
  }
}