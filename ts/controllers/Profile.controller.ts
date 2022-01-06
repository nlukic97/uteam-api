import { Request, Response } from 'express'
import Profile from '../models/Profile'
import User from '../models/User'

// Getting all profiles with a limit of 20
const getProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.findAll({limit:20})        
        return res.status(200).json(profiles)
    } catch(error){
        res.status(400).json({message:'There was an error when requesting the resource.'})
    }
}


// Gets one profile by id using the :id get request parameter
const getProfileById = async (req: Request, res: Response) => {
    try {
        if(!req.params.id || typeof(req.params.id) !== 'number'){
            throw 'Please make sure that the url parameter \'id\' is an integer.';
        }
        const profiles = await Profile.findOne({where:{id:req.params.id}})        
        return res.status(200).json(profiles)
    } catch(error){
        res.status(400).json({message:error})
    }
}


// insert a new profile from POST request body
const insertNewProfile = async (req: Request, res: Response) => {
    const submitData = {
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        user: parseInt(req.body.user)
    }   
    
    // making sure all three body params are present
    if(!submitData.name || !submitData.profilePhoto || !submitData.user){
        return res.status(401).json({message:'name, profilePhoto and user are required.'})
    }
    
    // making sure all three parameters are of the correct type
    if(typeof(submitData.name) !== 'string' || submitData.name === ''
    ||typeof(submitData.profilePhoto) !== 'string' || submitData.profilePhoto === ''
    || submitData.user % 1 !== 0
    ){
        return res.status(401).json({message:'Please make sure the name, profilePhoto, and user are of the correct type.'})
    }
    
    // check if user of a certain id exists. If yes, create the profile with this user id. If no, throw an error.
    try {
        // checking if this user exists
        const userExists = await User.findOne({where:{
            id: submitData.user
        }}).catch(e=>{
            throw e
        })
        
        if(userExists === null){
            throw `A user with the id ${submitData.user} does not exist and cannot be assigned to this profile.`;
        }
        
        // constructing the profile
        const profile = await Profile.build(submitData)
        
        profile.save().then(()=>{
            return res.status(200).json({message:'Profile with id ' + profile.id +' created successfully.'})
        }).catch(err=>{
            throw err
        })
        
    } catch(error){
        res.status(400).json({message:error})
    }
}


// insert a new profile from POST request body
const updateProfile = async (req: Request, res: Response) => {
    if(!req.params.id || typeof(req.params.id) !== 'number'){
        throw 'Please make sure that the url parameter \'id\' is an integer.';
    }

    /* const submitData = {
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        user: parseInt(req.body.user)
    }   
    
    // making sure all three body params are present
    if(!submitData.name || !submitData.profilePhoto || !submitData.user){
        return res.status(401).json({message:'name, profilePhoto and user are required.'})
    }
    
    // making sure all three parameters are of the correct type
    if(typeof(submitData.name) !== 'string' || submitData.name === ''
    ||typeof(submitData.profilePhoto) !== 'string' || submitData.profilePhoto === ''
    || submitData.user % 1 !== 0
    ){
        return res.status(401).json({message:'Please make sure the name, profilePhoto, and user are of the correct type.'})
    }
    
    // check if user of a certain id exists. If yes, create the profile with this user id. If no, throw an error.
    try {
        // checking if this user exists
        const userExists = await User.findOne({where:{
            id: submitData.user
        }}).catch(e=>{
            throw e
        })
        
        if(userExists === null){
            throw `A user with the id ${submitData.user} does not exist and cannot be assigned to this profile.`;
        }
        
        // constructing the profile
        const profile = await Profile.build(submitData)
        
        profile.save().then(()=>{
            return res.status(200).json({message:'Profile with id ' + profile.id +' created successfully.'})
        }).catch(err=>{
            throw err
        })
        
    } catch(error){
        res.status(400).json({message:error})
    } */
}

const ProfileController = {
    getProfiles,
    getProfileById,
    insertNewProfile,
    updateProfile,
}

export default ProfileController
