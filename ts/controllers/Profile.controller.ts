import { Request, Response } from 'express'

import Profile from '../models/Profile'
import User from '../models/User'
import Company from '../models/Company'

// import { insertProfileValidation } from '../validation_logic/Profile.validation' // currently not implemented, only testing

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
        const profiles = await Profile.findOne({where:{id:+req.params.id}}) 
        return res.status(200).json(profiles)
    } catch(error){
        res.status(400).json({message:error})
    }
}


// insert a new profile from POST request body
const insertNewProfile = async (req: Request, res: Response) => {
    /* Validation done with middleware */
    const data:{
        name:string,
        profilePhoto:string,
        user: number,
        company:number
    } = req.body
    
    
    // Query checks before submit
    try {
        // checking if submitted user exists
        const userExists = await User.findOne({where:{
            id: data.user
        }})
        if(userExists === null) throw `A user with the id ${data.user} does not exist and cannot be assigned to this profile.`;
        
        
        // checking if submitted company exists
        const companyExists = await Company.findOne({where:{
            id: data.company
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
        return res.status(400).json({message:error})
    }
}


// insert a new profile from POST request body
const updateProfile = async (req: Request, res: Response) => {
    const submitData = req.body
    
    // Check if user and / or profile exist, if a new value for these fields was submitted
    try {
        // 1. checking if the profile from the req.params.id exists
        const profileExists = await Profile.findOne({
            where:{
                id: req.params.id
            },
            include:User
        })
        
        if(profileExists === null) throw `A profile with the id ${req.params.id} does not exist and cannot be assigned to this profile.`;

        // If the user who has the profile is not the same as the user who is making this request (from passport-jwt)
        if(profileExists.User.id !== req.user.id) throw `You are not the owner of the profile ${req.params.id}, and cannot change it.`; //error on user, might have to declare on Company model
        
        // 2. checking if a company with a specific id exists (if it is supplied by the user in the req.body.user parameter)
        if(submitData.company){ 
            const companyExists = await Company.findOne({where:{
                id: submitData.company
            }})
            if(companyExists === null) throw `A company with the id ${submitData.company} does not exist and cannot be assigned to this profile.`;
        }
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
        const profile = await Profile.findOne({
            where:{
                id: req.params.id
            },
            include:User
        })
        
        if(profile){
            if(profile.User.id !== req.user.id) throw `You are not the owner of the profile ${req.params.id}, and cannot delete it.`; //error on user, might have to declare on Profile model

            profile.destroy()
            .then(()=>{
                return res.status(200).json({message:'Profile with id '+ req.params.id + ' has been deleted.'})
            })
            .catch(err=>{
                throw err
            })
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
