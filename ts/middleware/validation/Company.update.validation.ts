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
    
    /** Validation of name param */
    if(req.body.name !== undefined){
        if(typeof req.body.name !== 'string'){
            return res.status(400).json({message:'The name should be a string.'})
        }
        req.body.name = req.body.name.trim()
        if(!req.body.name){
            return res.status(400).json({message:'The name cannot be an empty string.'})
        }
        submitData.name = req.body.name
        submitData.slug = createSlug(submitData.name as string) //this line only executes if the param is a non-empty string
        
        if(!submitData.slug){
            return res.status(400).json({message:'Unable to create slug - please make sure the name contains letters and / or numbers'})
        }
    }
    
    /** Validation of logo param */
    if(req.body.logo !== undefined){
        if(typeof req.body.logo !== 'string'){
            return res.status(400).json({message:'The logo should be a string.'})
        }
        req.body.logo = req.body.logo.trim()
        if(!req.body.logo){
            return res.status(400).json({message:'The logo cannot be an empty string.'})
        }
        submitData.logo = req.body.logo
    }
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.logo){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (logo and / or name).'})
    }

    req.body = submitData
    next()
}

export default CompanyUpdateValidation