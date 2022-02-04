export interface UserAttributes {
    id?: number, 
    username: string,
    role?:'company-user'|'company-admin'|'superadmin', //optional since we have a default value for enum
    email: string,
    password: string,
    createdAt?: string,
    updatedAt?: string
  }