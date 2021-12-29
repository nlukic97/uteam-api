import User from '../models/User'
import { Request, Response } from 'express'
import validator from 'validator'
import * as bcrypt from 'bcryptjs';

interface ReqRes {
  (req: Request, res: Response): unknown
}

// methods
const getAllUsers: ReqRes = async (req, res) => {
  const users = await User.findAll()
  res
    .status(200)
    .json({ message: `There are currently ${users.length} users.` })
}

/* --- User registration --- */
const register: ReqRes = async (req, res) => {
  // Trimming and sanitizing inputs
  const data = {
    username: validator.trim(req.body.username + '').toLowerCase(),
    email: validator.trim(req.body.email + '').toLowerCase(),
    password: validator.trim(req.body.password + '')
  }  


  if(!validator.isEmail(data.email)){
    return res.status(403).json({ message: 'Please make sure to enter valid email credentials.'})

  } else if (!/^[a-z0-9._]+$/.test(data.username)){ //username can contain letters, numbers, . and _
    return res.status(403).json({ message: 'Please enter a valid username - only lowercase letters, numbers, . and _ are allowed.'})
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data.password, salt);

  const insertData = {
    email: validator.normalizeEmail(data.email),
    username: data.username,
    password: hash
  }

  const user = await User.build(insertData)

  user
    .save()
    .then(() => {
      res.status(200).json({ message: 'User saved saved to the database!' })
    })
    // An error will be caught if the email or username have already been used
    .catch((foundErrors) => {
      const errorMessages: Array<object> = []

      foundErrors.errors.forEach((err: { message: object; }) => {        
        errorMessages.push({message: err.message})
      });

      res.status(403).json(errorMessages)
    })
}

/* --- User login --- */
const login: ReqRes = async (req, res)=>{
  const name: string = validator.trim(req.body.name + '').toLowerCase()
  const password: string = validator.trim(req.body.password + '')

  const key: string = (validator.isEmail(req.body.name)) ? 'email': 'username'

/*   interface User {
    id: number,
    username: string,
    email:string,
    password:string,
  } */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = await User.findOne({
    where: {
      [key]:name
    }
  })

  if(user === null){
    return res.status(404).json({message:`There is no user with this ${key}`})
  }

  const result: boolean = bcrypt.compareSync(password, user.password)
  if(result === true){
    return res.status(200).json({message:'You are logged in'})
  } else {
    return res.status(401).json({message:'Incorrect password.'})
  }
}

//   method export
const UserController = {
  getAllUsers,
  register,
  login
}

export default UserController
