import {Request, Response, NextFunction as Next } from 'express';
import validator from 'validator'
import User from '../../models/User';
import { Op } from 'sequelize'

const RegisterValidaton = async (req:Request,res:Response, next:Next)=>{
  interface RequestBody {
    username:string;
    email:string,
    password:string,
    profileName:string,
    profilePhoto?:string,
    companyLogo?:string,
    companyName?:string
  }

  const sentData:RequestBody = req.body
  
  // making sure all necessary data is there (null, undefined and '' will not pass this check). 'Users' table fields, and the profileName (name) field for the 'profiles' table
  if(!sentData.username || !sentData.email || !sentData.password || !sentData.profileName){
    return res.status(400).json({message:'Username, email, password, and / or profileName is / are missing.'})
  }
  
  // Checking if it is a string
  if(typeof(sentData.username) !== 'string'
  || typeof(sentData.email) !== 'string'
  || typeof(sentData.password) !== 'string'
  || typeof(sentData.profileName) !== 'string' //'profiles' table
  ){
    return res.status(400).json({message:'Please make sure you submited the username, email, password, and profileName in the correct format (a non empty string).'})
  }
  
  // Trimming and sanitizing inputs
  const data:RequestBody = {
    username: (sentData.username + '').trim(),
    email: (sentData.email + '').toLowerCase().trim(),
    password: (sentData.password + '').trim(),
    profileName: (sentData.profileName + '').trim() //'profiles' table
  }
  
  /* Validating optional parameters to be inserted into 'profiles' table */
  if(sentData.profilePhoto !== undefined){
    if(typeof(sentData.profilePhoto)!== 'string') return res.status(400).json({message:'Optional parameter profilePhoto must be a non-empty string.'})
    if(sentData.profilePhoto.trim() === '') return res.status(400).json({message:'Optional parameter profilePhoto must be a non-empty string.'})
    data.profilePhoto = sentData.profilePhoto.trim()
  }

  /* Validating optional parameters to be inserted into 'companies' table */
  if(sentData.companyLogo !== undefined){
    if(typeof(sentData.companyLogo)!== 'string') return res.status(400).json({message:'Optional parameter companyLogo must be a non-empty string.'})
    if(sentData.companyLogo.trim() === '') return res.status(400).json({message:'Optional parameter companyLogo must be a non-empty string.'})
    data.companyLogo = sentData.companyLogo.trim()
  }
  
  if(sentData.companyName !== undefined){
    if(typeof(sentData.companyName)!== 'string') return res.status(400).json({message:'Optional parameter companyName must be a non-empty string.'})
    if(sentData.companyName.trim() === '') return res.status(400).json({message:'Optional parameter companyName must be a non-empty string.'})
    data.companyName = sentData.companyName.trim()
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
  
  // profleName (name in `profiles` table)
  if(data.profileName === ''){
    return res.status(403).json({ message: 'Your profileName should cannot be an empty string.'})
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
  
  req.body = data
  
  next() //modifying the req.body (which is now checked, validated and sanitized, to be inserted into the table)
}

export default RegisterValidaton