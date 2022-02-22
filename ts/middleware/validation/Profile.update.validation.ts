import {Request, Response, NextFunction as Next } from 'express';


const ProfileUpdateValidation = (req:Request,res:Response,next:Next) =>{
    
    if(!req.params.id || Number.isInteger(+req.params.id) === false){
        return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
    }
    
    //All three are technically optional, but something should be submitted, validation for this is 2 paragraphs lower
    const submitData:{
        name?:string,
        profilePhoto?:string,
        company?: number,
    } = {}
    
    /** Validation of submitted name */
    if(req.body.name !== undefined){
        if(typeof req.body.name !== 'string'){
            return res.status(400).json({message:'The name should be a string.'})
        }
        
        req.body.name = req.body.name.trim()
        if(!req.body.name){
            return res.status(400).json({message:'The name cannot be an empty string.'})
        }
        submitData.name = req.body.name
    }
    
    /** Validation of submitted profilePhoto */
    if(req.body.profilePhoto !== undefined){
        if(typeof req.body.profilePhoto !== 'string'){
            return res.status(400).json({message:'The profilePhoto should be a string.'})
        }

        req.body.profilePhoto = req.body.profilePhoto.trim()
        if(!req.body.profilePhoto){
            return res.status(400).json({message:'The profilePhoto cannot be an empty string.'})
        }
        submitData.profilePhoto = req.body.profilePhoto
    }
    
    /** Validation of submitted company */
    if(req.body.company !== undefined){
        if(req.body.company === ''){
            return res.status(400).json({message:'Company cannot be empty - please submit a valid company id.'})
        }
        if(Number.isInteger(+req.body.company) === false){
            return res.status(400).json({message:'The company should be an integer.'})
        }

        submitData.company = req.body.company
    }
    
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.profilePhoto && !submitData.company){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (name, profilePhoto, and / or company).'})
    }
    
    req.body = submitData

    next()
}

export default ProfileUpdateValidation