import User from '../models/User'
import { Request, Response } from 'express'

interface ReqRes {
  (req: Request, res: Response): unknown
}

// methods
const getAllUsers: ReqRes = async (req, res) => {
  const users = await User.findAll()
  res
    .status(200)
    .json({ message: `There are currently ${users.length} users.` })
}

/* interface dataInterface {
  username: string
  email: string
  password: string
} */

const insertNewUser: ReqRes = async (req, res) => {
  const user = await User.build({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  user
    .save()
    .then(() => {
      res.status(200).json({ message: 'User saved saved to the database!' })
    })
    .catch(() => {
      res.status(403).json({ message: 'There was an error saving this user.' })
    })
}

//   method export
const UserController = {
  getAllUsers,
  insertNewUser,
}

export default UserController
