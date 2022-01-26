import dotenv from 'dotenv'
dotenv.config()

/* Import model */
import Profile from '../models/Profile'

/* Other modules */
import faker from 'faker'
import { getRandomInt } from '../utils/functions'

const ProfileSeeder = (max: number): void => {
  let num = 0
  
  /* uncomment the block quote underneath, and update/edit it to create a seeder for the Profile model. */
  while (num < max) {
    Profile.build({
      // status: 'pending', //default
      name: faker.name.firstName(),
      profilePhoto: faker.system.directoryPath(),
      user: num + 1,
      company: getRandomInt(1,21) // starting from 1, ending with 20
    }).save()
    
    num++
  }
}

export default ProfileSeeder
/*please make sure to import this seeder into Seeder.ts, and to call it. */