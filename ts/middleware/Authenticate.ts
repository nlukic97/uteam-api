// Middleware
import {Request, Response, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken'


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RequestExtra extends Request {
  user: jwt.JwtPayload | undefined; //adding this removes the error at line 25. But causes a 'no overload matches this call' error in routes.ts
}

const authenticateToken = (req: RequestExtra, res: Response, next: Next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader?.split(' ')[1]
    if(token === null) {
      return res.sendStatus(401)
    }
  
    jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET as string, (err,user)=>{
      if(err) {
        return res.sendStatus(403)
      }
  
      req.user = user
      next()
    })
  
  }

  export default authenticateToken