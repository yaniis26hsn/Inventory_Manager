import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHelloWld(): string {
    return "hellow wld" 
  }
  sayWelcome(name:string , age: number): string{
    return "wecame " + name + " you are : " + age+ " yo"
  }
}
