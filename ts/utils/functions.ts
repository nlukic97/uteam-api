import { UserRoles, UserRolesArray } from "../ts_interfaces/User.Interface";

export function getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

export function createSlug(string:string):string{
  // return string.toLowerCase().split(' ').join('-').trim()
  const regex = /[^A-Za-z0-9-\s]/g // so we will remove all characters that are not letters, numbers, space characters, or slashes
  return string.replaceAll(regex,'').replaceAll(' ','-')
}

export const getRandomUserRole = function(int:number):keyof typeof UserRoles {
  const roles:UserRolesArray = ['company-user','company-admin','superadmin']
  return roles[int]
}