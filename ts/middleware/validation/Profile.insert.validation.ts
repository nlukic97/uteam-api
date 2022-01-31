import {Request, Response, NextFunction as Next } from 'express';


const ProfileInsertValidation = (req:Request,res:Response,next:Next) =>{
    const submitData:{
        name:string,
        profilePhoto:string,
        user: number,
        company:number
    } = {
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        user: +req.body.user,
        company: +req.body.company
    }
    
    // making sure all three body params are present
    if(!submitData.name || !submitData.profilePhoto || !submitData.user || !submitData.company){
        return res.status(400).json({message:'Please make sure to submit the name, profilePhoto, user, and company are of the correct type.'})
    }
    
    // making sure all three parameters are of the correct type (strings, and user to be an integer)
    if(typeof(submitData.name) !== 'string'
    ||typeof(submitData.profilePhoto) !== 'string'
    || Number.isInteger(submitData.user) === false
    || Number.isInteger(submitData.company) === false
    ){
        return res.status(400).json({message:'Please make sure the name, profilePhoto, user, and company are of the correct type.'})
    }
    
    const data = {
        name: submitData.name.trim(),
        profilePhoto: submitData.profilePhoto.trim(),
        user: submitData.user,
        company: submitData.company
    }
    
    // One more validation after trimming the strings (this prevents a user submitting an empty space as a valid field for name && profilePhoto)
    if(!data.name || !data.profilePhoto || !data.user || !data.company){
        return res.status(400).json({message:'name, profilePhoto and user are required.'})
    }

    req.body = data
    next()
}

export default ProfileInsertValidation