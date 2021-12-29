import dotenv from 'dotenv'
dotenv.config()

/* Import model */
import User from '../models/User'

/* Other modules */
import faker from 'faker'

const UserSeeder = (max: number): void => {
  let num = 0

  while (num < max) {
    User.build({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save()

    num++
  }
}

export default UserSeeder
