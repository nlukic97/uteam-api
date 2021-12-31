// Middleware
import {Request, Response, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken'


const authenticateToken = (req: Request, res: Response, next: Next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader?.split(' ')[1]
    if(token === null) {
      return res.sendStatus(401)
    }
  
    //not sure how to fix this here, I cannot set anything to 'token' on line 8
    jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
      if(err) {
        return res.sendStatus(403)
      }
  
      req.user = user
      next()
    })
  
  }

  export default authenticateToken