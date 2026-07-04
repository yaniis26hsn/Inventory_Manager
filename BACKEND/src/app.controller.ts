import { Body, Controller, Get , Param, Post, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly aappService: AppService) {}


}