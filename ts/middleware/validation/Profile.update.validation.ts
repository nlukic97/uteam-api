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
    
    /** Validation of submitted data - checking if an optional parameter has been submitted as an empty string. */
    if(req.body.name !== undefined){        
        if(req.body.name === ''){            
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.name = req.body.name
        }
    }

    if(req.body.profilePhoto !== undefined){
        if(req.body.profilePhoto === ''){
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.profilePhoto = req.body.profilePhoto
        }
    }

    if(req.body.company !== undefined){        
        if(req.body.company === ''){            
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.company = +req.body.company
        }
    }
    
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.profilePhoto && !submitData.company){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (name, profilePhoto, and / or company).'})
    }
    
    
    //checking that present submitData is of correct type
    if(
       (submitData.name && typeof(submitData.name) !== 'string') 
    || (submitData.profilePhoto && typeof(submitData.profilePhoto) !== 'string')
    || (submitData.company && (Number.isInteger(submitData.company) === false || submitData.company === 0))
    ) {
        return res.status(400).json({message:'Please make sure the your submitted inputs of the correct format.'})
    }
    
    // trimming the name if it was submitted, and checking that a value is still left after we trim (deals with submitted spaces as values)
    if(submitData.name){
        submitData.name = submitData.name.trim()
        if(!submitData.name){
            return res.status(400).json({message:'Please make sure the name is of the correct format.'})
        }
    }
    
    // trimming the profilePhoto if it was submitted, and checking that a value is still left after we trim (deals with submitted spaces as values)
    if(submitData.profilePhoto){
        submitData.profilePhoto = submitData.profilePhoto.trim()
        if(!submitData.profilePhoto){
            return res.status(400).json({message:'Please make sure the profilePhoto is of the correct format.'})
        }
    }
    
    req.body = submitData

    next()
}

export default ProfileUpdateValidation