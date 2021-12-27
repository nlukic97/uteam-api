import User from '../models/User'

const UserSeeder = (max: number): void => {
  let num = 0

  while (num < max) {
    User.build({
      username: `user${num}`,
      email: `user${num}@example.com`,
      password: `secret-password-${num}`,
    }).save()

    num++
  }
}

export default UserSeeder
