/* User.sync() // will create the user table if it does not exist
// sequelize.sync() //will create tables for all models if they do not already exist

//Adding three users
function insertNewUser(username: string, email: string, password: string) {
  const user = User.build({
    username,
    email,
    password,
  })
  user.save()
}

// Adding three users
insertNewUser('User', 'example@email.com', 'topsecret')
insertNewUser('User', 'example@email.com', 'topsecret')
insertNewUser('User', 'example@email.com', 'topsecret')

// selecting a user
async function getUser(params: object) {
  const user: object[] = await User.findAll({
    where: {
      ...params,
    },
  })

  return user
}

getUser({ username: 'User' }).then(users => {
  // console.log(users)
  console.log('Number of users who matched the SQL query:', users.length)
})

// Routes

// //  /user-count - counts the number of users in the user table, and returns it.
// app.get('/user-count', async (_, res: Response) => {
//   const users = await User.findAll()
//   res
//     .status(200)
//     .json({ message: `There are currently ${users.length} users.` })
// })
 */
