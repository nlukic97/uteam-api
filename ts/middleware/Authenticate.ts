// Middleware
import {Request, Response, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken'

const authenticateToken = (req: Request, res: Response, next: Next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader?.split(' ')[1]
    if(token === null) {
      return res.sendStatus(401)
    }
  
    jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET as string, (err,user)=>{
      if(err) {
        return res.sendStatus(403)
      }

      console.log('here is user',user);
      
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).user = user
      next()
    })
  
  }

  export default authenticateToken