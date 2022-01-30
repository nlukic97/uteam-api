import {Request, Response, NextFunction as Next } from 'express';
import validator from 'validator'
import User from '../../models/User';
import { Op } from 'sequelize'

const RegisterValidaton = async (req:Request,res:Response, next:Next)=>{
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

      req.body = data
      next() //modifying the req.body (which is now checked, validated and sanitized, to be inserted into the table)
}

export default RegisterValidaton