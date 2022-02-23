import { Request, Response, NextFunction as Next } from 'express'

const CompanyInsertValidation = (req:Request, res:Response,next:Next) =>{
    const submitData:{
        name:string,
        logo:string
    } = {
        name: req.body.name,
        logo: req.body.logo
    }
    
    if(!submitData.logo || !submitData.name){
        return res.status(400).json({message:'Name and logo are required fields.'})
    }
    
    if(typeof(submitData.name) !== 'string'
    || typeof(submitData.logo) !== 'string'
    ){
        return res.status(400).json({message:'Please make sure the name and logo are of the correct type.'})
    }
    
    // trimming string
    const data:{
        name:string,
        logo:string
    } = {
        name: submitData.name.trim(),
        logo: submitData.logo.trim()
    }
    
    // checking if there are any values left to be submitted after trimming
    if(!data.name || !data.logo){
        return res.status(400).json({message:'name and logo are required.'})
    }

    req.body = data

    next()
}

export default CompanyInsertValidation