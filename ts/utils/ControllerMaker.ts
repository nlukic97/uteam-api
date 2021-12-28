import { exec } from 'child_process'
import fs from 'fs'

const title = process.argv[2].toLowerCase() //this gets the argument the user passes in with --
const Title = title
  .split('')
  .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
  .join('')

const ControllerPath = `./ts/controllers/${Title}Controller.ts`

exec(`touch ${ControllerPath} && tsc`)

// content to be added to the seeder
const content = `import { Request, Response } from 'express'

/** Add methods underneath*/
const doSomething = (req: Request, res: Response) => {
    res.status(200).json({
      status: 200,
      message: 'OK',
    })
}
    
/** Export the methods*/
const ${Title}Controller = {
  doSomething,
}

export default ${Title}Controller
`

fs.writeFile(ControllerPath, content, err => {
  if (err) {
    console.error(err)
    return
  }

  console.log('File writted successfully.')
})
