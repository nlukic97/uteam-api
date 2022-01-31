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

type userRoleArray = ['company-user','company-admin','superadmin']
type userRole = 'company-user'|'company-admin'|'superadmin'

export const getRandomUserRole = function(int:number):userRole {
  const roles:userRoleArray = ['company-user','company-admin','superadmin']
  return roles[int]
}