import dotenv from 'dotenv'
dotenv.config()

/* Import model */
import User from '../models/User'

/* Other modules */
import faker from 'faker'
import { getRandomInt,getRandomUserRole } from '../utils/functions'

const UserSeeder = (max: number): void => {
  let num = 0
  while (num < max) {
    User.build({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: getRandomUserRole(getRandomInt(0,3))
    }).save()

    num++
  }
}

export default UserSeeder
