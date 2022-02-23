export enum UserRoles {
  'company-user',
  'company-admin',
  'superadmin'
}

export type UserRolesArray = ['company-user','company-admin','superadmin']


export interface UserAttributes {
    id?: number, 
    username: string,
    role?:keyof typeof UserRoles, //optional since we have a default value for enum
    email: string,
    password: string,
    createdAt?: string,
    updatedAt?: string
  }