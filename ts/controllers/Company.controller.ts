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
    /* Validation done with middleware */
    const data:{
        name:string,
        logo:string
    } = req.body

    
    try {
        // checking if a company with the same submitted name exists
        const companyExists = await Company.findOne({where:{
            name: data.name
        }})
        if(companyExists) throw 'A profile with this name already exists. Please enter another name.'
        
        
        // constructing the profile and inserting into db
        Company.create({
            ...data,
            slug: createSlug(data.name),
            companyOwner: 1 // current fix for now, but will have to get this from the JWT
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

// updating rows in the company table. Only submitted rows will be considered for update (at least one should be submitted)
const updateCompany = async (req:Request, res:Response)=>{
    /* Validation done with middleware */
    
    const submitData:{
        name?:string,
        logo?:string,
        slug?:string
    } = req.body

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