import { Request, Response } from 'express'
import Profile from '../models/Profile'
import User from '../models/User'

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
        user: number
    } = {
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        user: req.body.user
    }   
    
    // making sure all three body params are present
    if(!submitData.name || !submitData.profilePhoto || !submitData.user){
        return res.status(400).json({message:'name, profilePhoto and user are required.'})
    }
    
    // making sure all three parameters are of the correct type (strings, and user to be an integer)
    if(typeof(submitData.name) !== 'string' || submitData.name === ''
    ||typeof(submitData.profilePhoto) !== 'string' || submitData.profilePhoto === ''
    || Number.isInteger(+submitData.user) === false
    ){
        return res.status(400).json({message:'Please make sure the name, profilePhoto, and user are of the correct type.'})
    }
    
    // check if user of a certain id exists. If yes, create the profile with this user id. If no, throw an error.
    try {
        // checking if this user exists
        const userExists = await User.findOne({where:{
            id: submitData.user
        }})
        if(userExists === null) throw `A user with the id ${submitData.user} does not exist and cannot be assigned to this profile.`;


        // Checking if a profile with a certain name exists
        const profileExists = await Profile.findOne({where:{
            name: submitData.name
        }})
        if(profileExists) throw 'A profile with this name already exists. Please enter another name.'

        
        // constructing the profile
        Profile.create(submitData).then((profile)=>{
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
        name?:string|undefined,
        profilePhoto?:string|undefined,
        user?: number|undefined
    } = {}
    
    /** Validation of submitted data - checking if any data has been submitted. */
    if(req.body.name || req.body.name !== '') submitData.name = req.body.name
    if(req.body.profilePhoto || req.body.profilePhoto !== '') submitData.profilePhoto = req.body.profilePhoto
    if(req.body.user || req.body.user !== '') submitData.user = req.body.user
    
    
    // making sure at least one of the editable parameters is present
    if(!submitData.name && !submitData.profilePhoto && !submitData.user){
        return res.status(400).json({message:'No data submitted for update. Please submit the fields you would like to change (name, profilePhoto, or user).'})
    }
    
    
    //checking that present submitData is of correct type
    if(
       (submitData.name && typeof(submitData.name) !== 'string') 
    || (submitData.profilePhoto && typeof(submitData.profilePhoto) !== 'string')
    || (submitData.user && (Number.isInteger(+submitData.user) === false))
    ) {
        return res.status(400).json({message:'Please make sure the name, profilePhoto, and / or user are of the correct type.'})
    }    

    // Check if user and / or profile exist
    try {
        // checking if a user with a specific id exists (if it is supplied by the user in the req.body.user parameter)
        if(submitData.user){ 
            const userExists = await User.findOne({where:{
                id: submitData.user
            }})
            
            if(userExists === null) throw `A user with the id ${submitData.user} does not exist and cannot be assigned to this profile.`;
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
