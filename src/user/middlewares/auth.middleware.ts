import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response  } from "express";
import { verify } from "jsonwebtoken";
import { ExpressRequest } from "src/common/types/expressRequest.interface";
import { JWT_SECRET } from "../config";
import { UserService } from "../user.service";

/*
?  what is a middleware ? 
* it's actually a class 
-> 
*/
@Injectable()
export class AuthMiddleware implements  NestMiddleware {
    constructor(private readonly srv: UserService){}
     async use(req: ExpressRequest, _: Response , next: NextFunction ){
        //* the idea is that we can read all these things here and then do next
        //*  and next means that we did everything that we wanted and we want to continue with passing our request to the controller 
        if (!req.headers.authorization){
            req.user = null;
            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];

        try{
         const decode = verify(token , JWT_SECRET) as JwtPayload;
         const user = await this.srv.findById(decode.id) 
         req.user = user;
         next();
        } catch(err) {
         req.user = null;
         next();
        }
         //* and now here we must call next just like this to say that we're finished with our middleware
    }
}