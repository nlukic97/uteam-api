// Middleware
import {Request, Response, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken'

type headerToken = string | undefined

const authenticateToken = (req: Request, res: Response, next: Next) =>{
  const authHeader:headerToken = req.headers['authorization']
  const token: headerToken = authHeader && authHeader?.split(' ')[1]
  
  if(token === undefined) {
    return res.sendStatus(401)
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
    if(err) {
      return res.sendStatus(403)
    }
    
    req.user = user
    next()
  })
}

export default authenticateToken