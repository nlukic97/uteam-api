import { Request, Response } from 'express'
import validator from 'validator'

import Profile from '../models/Profile'
import User from '../models/User'
import Company from '../models/Company'

// Getting all profiles with a limit of 20
const getProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.findAll({limit:20})  
        return res.status(200).json(profiles)
    } catch(error){
        res.status(400).json({message:error})
    }
}


// Gets one profile by id using the :id get request parameter
const getProfileById = async (req: Request, res: Response) => {
    try {
        if(!req.params.id || Number.isInteger(+req.params.id) === false){
            return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
        }
        const profiles = await Profile.findOne({where:{id:req.params.id}}) 
        return res.status(200).json(profiles)
    } catch(error){
        res.status(400).json({message:error})
    }
}


// insert a new profile from POST request body
const insertNewProfile = async (req: Request, res: Response) => {
    const submitData:{
        name:string,
        profilePhoto:string,
        user: number,
        company:number
    } = {
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        user: req.body.user,
        company:req.body.company
    }   
    
    // making sure all three body params are present
    if(!submitData.name || !submitData.profilePhoto || !submitData.user || !submitData.company){
        return res.status(400).json({message:'name, profilePhoto, user, and company are required.'})
    }
    
    // making sure all three parameters are of the correct type (strings, and user to be an integer)
    if(typeof(submitData.name) !== 'string'
    ||typeof(submitData.profilePhoto) !== 'string'
    || Number.isInteger(+submitData.user) === false
    || Number.isInteger(+submitData.company) === false
    ){
        return res.status(400).json({message:'Please make sure the name, profilePhoto, user, and company are of the correct type.'})
    }
    
    const data = {
        name: validator.trim(submitData.name),
        profilePhoto: validator.trim(submitData.profilePhoto),
        user: submitData.user,
        company: submitData.company
    }
    
    // One more validation after trimming the strings (this prevents a user submitting an empty space as a valid field for name && profilePhoto)
    if(!data.name || !data.profilePhoto || !data.user || !data.company){
        return res.status(400).json({message:'name, profilePhoto and user are required.'})
    }
    
    // Query checks before submit
    try {
        // checking if submitted user exists
        const userExists = await User.findOne({where:{
            id: data.user
        }})
        if(userExists === null) throw `A user with the id ${data.user} does not exist and cannot be assigned to this profile.`;


        // checking if submitted company exists
        const companyExists = await Company.findOne({where:{
            id: data.user
        }})
        if(companyExists === null) throw `A company with the id ${data.company} does not exist and cannot be assigned to this profile.`;


        // Checking if a profile submitted name exists
        const profileExists = await Profile.findOne({where:{
            name: data.name
        }})
        if(profileExists) throw 'A profile with this name already exists. Please enter another name.'

        
        // previous checks have passed - constructing the profile
        Profile.create(data).then((profile)=>{
            return res.status(200).json({message:'Profile with id ' + profile.id + ' created successfully.'})
        }).catch(err=>{
            throw err
        })
        
    } catch(error){
        res.status(400).json({message:error})
    }
}


// insert a new profile from POST request body
const updateProfile = async (req: Request, res: Response) => {
    if(!req.params.id || Number.isInteger(+req.params.id) === false){
        return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
    }
    
    //All three are technically optional, but something should be submitted, validation for this is 2 paragraphs lower
    const submitData:{
        name?:string,
        profilePhoto?:string,
        user?: number,
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

    if(req.body.user !== undefined){        
        if(req.body.user === ''){            
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.user = req.body.user
        }
    }

    if(req.body.company !== undefined){        
        if(req.body.company === ''){            
            return res.status(400).json({message:'There appear to be empty fields. Please check your inputs and try again.'})
        } else {
            submitData.company = req.body.company
        }
    }
    
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.profilePhoto && !submitData.user && !submitData.company){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (name, profilePhoto, user, and / or company).'})
    }
    
    
    //checking that present submitData is of correct type
    if(
       (submitData.name && typeof(submitData.name) !== 'string') 
    || (submitData.profilePhoto && typeof(submitData.profilePhoto) !== 'string')
    || (submitData.user && (Number.isInteger(+submitData.user) === false))
    || (submitData.company && (Number.isInteger(+submitData.company) === false))
    ) {
        return res.status(400).json({message:'Please make sure the name, profilePhoto, user and / or company are of the correct type.'})
    }
    
    // trimming the name if it was submitted, and checking that a value is still left after we trim (deals with submitted spaces as values)
    if(submitData.name){
        submitData.name = validator.trim(submitData.name)
        if(!submitData.name){
            return res.status(400).json({message:'Please make sure the name is of the correct format.'})
        }
    }
    
    // trimming the profilePhoto if it was submitted, and checking that a value is still left after we trim (deals with submitted spaces as values)
    if(submitData.profilePhoto){
        submitData.profilePhoto = validator.trim(submitData.profilePhoto)
        if(!submitData.profilePhoto){
            return res.status(400).json({message:'Please make sure the profilePhoto is of the correct format.'})
        }
    }

    // Check if user and / or profile exist, if a new value for these fields was submitted
    try {
        // checking if a user with a specific id exists (if it is supplied by the user in the req.body.user parameter)
        if(submitData.user){ 
            const userExists = await User.findOne({where:{
                id: submitData.user
            }})
            
            if(userExists === null) throw `A user with the id ${submitData.user} does not exist and cannot be assigned to this profile.`;
        }

        // checking if a company with a specific id exists (if it is supplied by the user in the req.body.user parameter)
        if(submitData.company){ 
            const companyExists = await Company.findOne({where:{
                id: submitData.company
            }})
            
            if(companyExists === null) throw `A company with the id ${submitData.company} does not exist and cannot be assigned to this profile.`;
        }

        // checking if the profile from the req.params.id exists
        const profileExists = await Profile.findOne({where:{
            id: req.params.id
        }})
        
        if(profileExists === null) throw `A profile with the id ${req.params.id} does not exist and cannot be assigned to this profile.`;
    } catch(err){
        return res.status(400).json({message:err})
    }
    

    // If all conditions are met, update the profile
    try {
        const profileUpdate = await Profile.update(submitData,{
            where:{
                id: req.params.id
            }
        })    
        
        if(profileUpdate){
            return res.status(200).json({message:'Profile with id '+ req.params.id + ' updated successfully.'})
        } else {
            throw 'Unable to update profile.'
        }
        
    } catch(error){
        res.status(400).json({message:error})
    }
}


// Delete a profile with by the supplied :id parameter
const deleteProfile = async (req: Request, res: Response) => {    
    if(!req.params.id || Number.isInteger(+req.params.id) === false){
        return res.status(400).json({message:'Please make sure that the url parameter \'id\' is an integer.'});
    }
    
    try {
        const profileDelete = await Profile.destroy({
            where:{
                id: req.params.id
            }
        })
        
        if(profileDelete){
            return res.status(200).json({message:'Profile with id '+ req.params.id + ' has been deleted.'})
        } else {
            throw 'Unable to delete profile - it has not been found.'
        }
    } catch(err){
        return res.status(400).json({message: err})
    }
}

const ProfileController = {
    getProfiles,
    getProfileById,
    insertNewProfile,
    updateProfile,
    deleteProfile
}

export default ProfileController
