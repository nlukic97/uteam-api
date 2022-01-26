/* 
export function insertProfileValidation(submitData:{
    name:string,
    profilePhoto:string,
    user: number,
    company:number
}){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validation:any = {
        error:null,
        data:null
    }

    
    // making sure all three body params are present
    if(!submitData.name || !submitData.profilePhoto || !submitData.user || !submitData.company){
        return (
            {error:{
                status:400,
                message:'name, profilePhoto, user, and company are required.'
            },
            data:null
            }
        )
    }
    
    // making sure all three parameters are of the correct type (strings, and user to be an integer)
    if(typeof(submitData.name) !== 'string'
    ||typeof(submitData.profilePhoto) !== 'string'
    || Number.isInteger(+submitData.user) === false
    || Number.isInteger(+submitData.company) === false
    ){
        return (
            {error:{
                status:400,
                message:'Please make sure the name, profilePhoto, user, and company are of the correct type..'
            },
            data:null
            }
        )
    }
    
    const data = {
        name: submitData.name.trim(),
        profilePhoto: submitData.profilePhoto.trim(),
        user: submitData.user,
        company: submitData.company
    }
    
    // One more validation after trimming the strings (this prevents a user submitting an empty space as a valid field for name && profilePhoto)
    if(!data.name || !data.profilePhoto || !data.user || !data.company){
        return (
            {error:{
                status:400,
                message:'name, profilePhoto and user are required.'
            },
            data:null
            }
        )
        
    }

    validation.data = data

    return validation
} */