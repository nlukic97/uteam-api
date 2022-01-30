import {Request, Response, NextFunction as Next } from 'express';
import validator from 'validator'


const LoginValidation = (req:Request,res:Response,next:Next) =>{
    const sentData:{name:string;password:string} = req.body
    
    // making sure all necessary data is there (null, undefined and '' will not pass this check) 
    if(!sentData.name || !sentData.password) {
        return res.status(400).json({message:'Please make sure you submitted all the necessary credentials (username or email, and password).'})
    }
    
    // Checking if it is a string
    // This error message will also be sent if the user sends the name key twice {name,name,password}
    // (which would make the name parameter be an array with these two values submitted under the name key)
    if(typeof(sentData.name) !== 'string'
    || typeof(sentData.password) !== 'string'
    ){
        return res.status(400).json({message:'Please make sure you submited the username/email and password in the correct format (a non empty string).'})
    }
    
    
    // string sanitization 
    const name: string = validator.trim(sentData.name + '').toLowerCase()
    const password: string = validator.trim(sentData.password + '')

    req.body.name = name
    req.body.password = password

    next()
}

export default LoginValidation