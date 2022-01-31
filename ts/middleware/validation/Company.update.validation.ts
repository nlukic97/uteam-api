import { Request, Response, NextFunction as Next } from 'express'
import { createSlug } from '../../utils/functions';

const CompanyUpdateValidation = (req:Request, res:Response, next:Next) =>{
    if(!req.params.id || Number.isInteger(+req.params.id) === false){
        return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
    }
    
    //All three are technically optional, but something should be submitted, validation for this is 2 paragraphs lower
    const submitData:{
        name?:string|undefined,
        logo?:string|undefined,
        slug?:string|undefined //added later to this object based on the submitted name
    } = {}
    
    /** Validation of submitted data - checking if the submitted body parameters are not an empty string. */
    if(req.body.name !== undefined){
        if(req.body.name === ''){
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.name = req.body.name
        }
    }
    if(req.body.logo !== undefined){
        if(req.body.logo === ''){
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.logo = req.body.logo
        }
    }
    
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.logo){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (logo and / or name).'})
    }
    
    
    //checking that present submitData is of correct type
    if(
       (submitData.name && typeof(submitData.name) !== 'string')
    || (submitData.logo && typeof(submitData.logo) !== 'string')
    ) {
        return res.status(400).json({message:'Please make sure the submitted parameters are of the correct type.'})
    }

    // trimming the available inputs, and returning an error if they are an empty string after trimming
    if(submitData.name){
        submitData.name = submitData.name.trim()
        if(!submitData.name){
            return res.status(400).json({message:'Please make sure the submitted parameters are of the correct type.'})
        }
        submitData.slug = createSlug(submitData.name)
    }

    if(submitData.logo){
        submitData.logo = submitData.logo.trim()
        if(!submitData.logo){
            return res.status(400).json({message:'Please make sure the submitted parameters are of the correct type.'})
        }
    }

    req.body = submitData

    next()
}

export default CompanyUpdateValidation