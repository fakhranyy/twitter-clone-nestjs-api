import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ExpressRequest } from "src/common/types/expressRequest.interface";
import * as request from 'supertest';

@Injectable()
export class AuthGuard implements CanActivate {
 canActivate(context: ExecutionContext): boolean  {
     const request = context.switchToHttp().getRequest<ExpressRequest>();
     if (request.user){
        return true; 
     }
     throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
 }
}