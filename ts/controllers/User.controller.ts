import User from '../models/User'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createSlug } from '../utils/functions'

import Company from '../models/Company'
import Profile from '../models/Profile'

import sequelize from '../config/database'

const defaultLogoSrc = 'https://d1qbemlbhjecig.cloudfront.net/prod/3.81.1/staticfiles/dist/app/bento-components/carousel/media/default-logo.svg?72d28710fb34f035c7eb69af17c16020'

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
  interface RequestBody {
    username:string;
    email:string,
    password:string,
    profileName:string,
    profilePhoto?:string,
    companyLogo?:string,
    companyName?:string
  }
  
  const data:RequestBody = req.body //req.body sanitized and validated in middleware
  
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data.password, salt);
  
  // Data used for user insert
  const insertUserData = {
    email: data.email,
    username: data.username,
    password: hash
  }
  
  // data used for company insert
  const insertCompanyData:{name:string, logo:string} = {
    name: data.companyName || `${data.username}'s company`,
    logo: data.companyLogo || defaultLogoSrc
  }
  
  // data used for profile insert
  const insertProfileData:{name:string, profilePhoto:string} = {
    name:data.profileName,
    profilePhoto:data.profilePhoto || defaultLogoSrc
  }
  
  let accessToken:string|undefined; //saving it outside of the .then so that it can be sent later
  ;
  
  
  // INSERTING INTO DB
  const t = await sequelize.transaction();
  try {
    const user = await User.create(insertUserData,{transaction: t})
    
    if(!user.id) throw 'Error'
    
    accessToken = jwt.sign({username: user.username, id: user.id}, process.env.ACCESS_TOKEN_SECRET)
    
    const company = await Company.create({
      ...insertCompanyData,
      companyOwner:user.id,
      slug:createSlug(insertCompanyData.name)
    },{transaction: t})
    
    await Profile.create({
      ...insertProfileData,
      user:user.id,
      company:company.id
    },{transaction: t})
    
    await t.commit()
    return res.status(200).json({ message: 'User saved saved to the database!', accessToken: accessToken})
    
  } catch(err){
    await t.rollback()
    return res.status(403).json({message:'An error occured whilest entering the user.'}) //maybe the rows should be removed from all three tables if there was an error in one of them?
  }
}

/* --- User login --- */
const login: ReqRes = async (req, res)=>{
  if(req.isAuthenticated()){
    const accessToken: string | undefined = await jwt.sign({username: req.user.username}, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({message:'User is authenticated.',token:accessToken})
  }
  return res.sendStatus(401) //added this just as a failsafe since passport will handle it
}

//   method export
const UserController = {
  countAllUsers,
  register,
  login
}

export default UserController
