import User from '../models/User'
import { Request, Response } from 'express'
import validator from 'validator'
import * as bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'

interface ReqRes {
  (req: Request, res: Response): unknown
}

// methods
/* --- Getting the number of users */
const countAllUsers: ReqRes = async (req, res) => {
  const userCount = await User.count()
  res
    .status(200)
    .json({ message:`There are currently ${userCount} users.`})
}

/* --- User registration --- */
const register: ReqRes = async (req, res) => {
  const sentData:{
    username:string;
    email:string,
    password:string
  }  = req.body

  // making sure all necessary data is there (null, undefined and '' will not pass this check) 
  if(!sentData.username || !sentData.email || !sentData.password){
    return res.status(400).json({message:'Username, email, and / or password is / are missing.'})
  }

  // Checking if it is a string
  if(typeof(sentData.username) !== 'string'
    || typeof(sentData.email) !== 'string'
    || typeof(sentData.password) !== 'string'
  ){
    return res.status(400).json({message:'Please make sure you submited the username, email, and password in the correct format (a non empty string).'})
  }

  // Trimming and sanitizing inputs
  const data = {
    username: (sentData.username + '').trim(),
    email: (sentData.email + '').toLowerCase().trim(),
    password: (sentData.password + '').trim()
  } 

  /** * Validation */

  // email check
  if(!validator.isEmail(data.email)){
    return res.status(403).json({ message: 'Please make sure to enter valid email credentials.'})
  }
  
  // username length check
  if(data.username.length < 3){
    return res.status(403).json({ message: 'Your username must contain at least 3 characters.'})
  }

  // username format check - first char must be a letter(capital or lowercase), others can be: letters(capital or lowercase) or these symbols: #%_*-)
  if (! /^[A-Za-z][A-Za-z0-9#%_*-]+$/.test(data.username)){
    return res.status(403).json({ message: 'Username must start with a letter of any case, and may contain letters of any case and the following symbols: #%_-*'})
  }

  //password length check
  if(data.password.length < 6){
    return res.status(403).json({ message: 'Your password should be at least 6 characters long.'})
  }


  /** Checking if a user with the same email and/or username exists, and tailoring the error message */
  const userExists = await User.findOne({
    where:{
      [Op.or]:[
        {email:data.email},
        {username:data.username},
      ]
    }
    })

  if(userExists){
    const match = [];
    
    if(userExists.email === data.email) match.push('email')
    if(userExists.username === data.username) match.push('username')

    const foundMsg = (match.length === 2) ? 'username and email have' : `${match[0]} has`
    return res.status(403).json({message:`The ${foundMsg} already been taken.`})
  }

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
      res.status(200).json({ message: 'User saved saved to the database!', accessToken: accessToken})
    })
    // An error will be caught if the email or username have already been used - just as a failsafe
    .catch((foundErrors) => {
      console.log(foundErrors);
            
      const errorMessages: Array<object> = []

      foundErrors.errors.forEach((err: { message: object; }) => {        
        errorMessages.push({message: err.message})
      });

      console.log(errorMessages);
      

      res.status(403).json(errorMessages)
    })
}

/* --- User login --- */
const login: ReqRes = async (req, res)=>{
  const sentData:{name:string;password:string} = req.body
  
  // making sure all necessary data is there (null, undefined and '' will not pass this check) 
  if(!sentData.name || !sentData.password) {
    return res.status(400).json({message:'Please make sure you submitted all the necessary credentials (username or email, and password).'})
  }

  // Checking if it is a string
  if(typeof(sentData.name) !== 'string'
  || typeof(sentData.password) !== 'string'
  ){
    return res.status(400).json({message:'Please make sure you submited the username/email and password in the correct format (a non empty string).'})
  }


  // string sanitization 
  const name: string = validator.trim(sentData.name + '').toLowerCase()
  const password: string = validator.trim(sentData.password + '')

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
