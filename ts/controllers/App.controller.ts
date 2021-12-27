import { Request, Response } from 'express'

const wildcard = (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    message: 'OK',
  })
}

const AppController = {
  wildcard,
}

export default AppController
