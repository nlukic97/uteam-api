import User from '../models/User'
import { Request, Response } from 'express'
import validator from 'validator'
import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface ReqRes {
  (req: Request, res: Response): unknown
}

/* --- Getting the number of users */
const countAllUsers: ReqRes = async (req, res) => {
  const userCount = await User.count()
  res
    .status(200)
    .json({ message:`There are currently ${userCount} users.`})
  }
  
  /* --- User registration --- */
  const register = async (req: Request, res: Response) => {
    /**  Data is validated using middleware/validation/Register.middleware.ts - check the routes file */

  const data:{username:string,email:string,password:string} = req.body //req.body sanitized and validated in middleware
  
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data.password, salt);

  const insertData = {
    email: data.email,
    username: data.username,
    password: hash
  }
  
  User.create(insertData)
  .then((user) => {   
      const accessToken:string | undefined = jwt.sign({username: user.username, id: user.id}, process.env.ACCESS_TOKEN_SECRET)
      return res.status(200).json({ message: 'User saved saved to the database!', accessToken: accessToken})
    })
    // An error will be caught if the email or username have already been used - just as a failsafe
    .catch((foundErrors) => {
      console.log(foundErrors);
            
      const errorMessages: Array<object> = []

      foundErrors.errors.forEach((err: { message: object; }) => {        
        errorMessages.push({message: err.message})
      });

      console.log(errorMessages);
      return res.status(403).json(errorMessages)
    })
}

/* --- User login --- */
const login: ReqRes = async (req, res)=>{
  /**  Data is validated using middleware/validation/Login.middleware.ts - check the routes file */

  const sentData:{name:string,password:string} = req.body //req.body sanitized and validated in middleware
  const password = req.body.password
  const name = req.body.name

  // determining if the user submitted an email or a username (used to find the user in the db to compare the login credentials against)
  const key: string = (validator.isEmail(sentData.name)) ? 'email': 'username'

  const user = await User.findOne({
    where: {
      [key]:name
    }
  })

  if(user === null){
    return res.status(404).json({message:`There is no user with this ${key}`})
  }

  // comparing the submitted password with the user password in the db
  const result: boolean = bcrypt.compareSync(password, user.password)
  if(result === true){
    const accessToken: string | undefined = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({message:'You are logged in', accessToken: accessToken})
  } else {
    return res.status(401).json({message:'Incorrect password.'})
  }
}

//   method export
const UserController = {
  countAllUsers,
  register,
  login
}

export default UserController
