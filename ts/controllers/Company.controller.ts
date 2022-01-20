import { Request, Response } from 'express'
import Company from '../models/Company'

import { createSlug } from '../utils/functions'


// getting all companies with a limit of 20
const getCompanies = async(req:Request,res:Response) => {
    try {
        const companies = await Company.findAll({limit:20})  
        return res.status(200).json(companies)
    } catch(error){
        res.status(400).json({message:error})
    }
}

// creates a new company
const insertNewCompany = async(req:Request, res:Response)=>{
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
    
    if(typeof(submitData.name) !== 'string' || submitData.name === ''
    || typeof(submitData.logo) !== 'string' || submitData.logo === ''
    ){
        return res.status(400).json({message:'Please make sure the name and logo are of the correct type.'})
    }
    
    try {
        // checking if a company with the same submitted name exists
        const companyExists = await Company.findOne({where:{
            name: submitData.name
        }})
        if(companyExists) throw 'A profile with this name already exists. Please enter another name.'
        
        
        // constructing the profile and inserting into db
        Company.create({
            ...submitData,
            slug: createSlug(submitData.name)
        })
        .then((company)=>{
            return res.status(200).json({message:'Company with id ' + company.id + ' created successfully.'})
        }).catch(err=>{
            throw err
        })
        
    } catch(error){
        res.status(400).json({message:error})
    }
}

// Getting one company by id
const getCompanyById = async (req:Request, res:Response) =>{
    try {
        if(!req.params.id || Number.isInteger(+req.params.id) === false){
            return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
        }
        const company = await Company.findOne({where:{id:req.params.id}})
        return res.status(200).json(company)
    } catch(error){
        res.status(400).json({message:error})
    }
}


const updateCompany = async (req:Request, res:Response)=>{
    if(!req.params.id || Number.isInteger(+req.params.id) === false){
        return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
    }
    
    //All three are technically optional, but something should be submitted, validation for this is 2 paragraphs lower
    const submitData:{
        name?:string|undefined,
        logo?:string|undefined,
        slug?:string|undefined
    } = {}
    
    /** Validation of submitted data - checking if any data has been submitted. */
    if(req.body.name || req.body.name !== '') submitData.name = req.body.name
    if(req.body.logo || req.body.logo !== '') submitData.logo = req.body.logo
    
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.logo){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (logo and / or name).'})
    }
    
    
    //checking that present submitData is of correct type
    if(
       (submitData.name && typeof(submitData.name) !== 'string')
    || (submitData.logo && typeof(submitData.logo) !== 'string')
    ) {
        return res.status(400).json({message:'Please make sure the logo and / or name are of the correct type.'})
    }

    // If the user would like to change the company name, we should also change the company slug
    if(submitData.name) submitData.slug = createSlug(submitData.name)

    // Check if company exists
    try {
        // checking if the company from the req.params.id exists
        const companyExists = await Company.findOne({where:{
            id: req.params.id
        }})
        
        if(companyExists === null) throw `A company with the id ${req.params.id} does not exist.`;
    } catch(err){
        return res.status(400).json({message:err})
    }
    

    // If all conditions are met, update the company
    try {
        const companyUpdate = await Company.update(submitData,{
            where:{
                id: req.params.id
            }
        })    
        
        if(companyUpdate){
            return res.status(200).json({message:'Company with id '+ req.params.id + ' updated successfully.'})
        } else {
            throw 'Unable to update company.'
        }
        
    } catch(error){
        res.status(400).json({message:error})
    }
}


/* Deleting a company by id */
const deleteCompany = async (req:Request, res:Response)=>{
    if(!req.params.id || Number.isInteger(+req.params.id) === false){
        return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
    }
    
    try {
        const companyDelete = await Company.destroy({
            where:{
                id: req.params.id
            }
        })
        
        if(companyDelete){
            return res.status(200).json({message:'Company with id '+ req.params.id + ' has been deleted.'})
        } else {
            throw 'Unable to delete company - it has not been found.'
        }
    } catch(err){
        return res.status(400).json({message: err})
    }
}

const CompanyController = {
    getCompanies,
    insertNewCompany,
    getCompanyById,
    updateCompany,
    deleteCompany
}

export default CompanyController