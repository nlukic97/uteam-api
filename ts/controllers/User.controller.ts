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

/* interface dataInterface {
  username: string
  email: string
  password: string
} */

const register: ReqRes = async (req, res) => {
  // escaping inputs
  const data = {
    username: (req.body.username + '').toLowerCase(),
    email: (req.body.email + '').toLowerCase(),
    password: req.body.password + '',
  }

  console.log(data);
  

  // Trimming inputs
  data.username = validator.trim(data.username)
  data.email = validator.trim(data.email)
  data.password = validator.trim(data.password)

  if(!validator.isEmail(data.email)){
    return res.status(403).json({ message: 'Please make sure to enter valid email credentials.'})

  } else if (!/^[a-z0-9._]+$/.test(data.username)){ //username can contain letters, numbers, . and _
    return res.status(403).json({ message: 'Please enter a valid username - only lowercase letters, numbers, dots (.) and underscores (_) are allowed.'})
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

// const login: ReqRes = async (req, res)=>{

// }

//   method export
const UserController = {
  getAllUsers,
  register,
  // login
}

export default UserController
