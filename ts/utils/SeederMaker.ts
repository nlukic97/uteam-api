import { exec } from 'child_process'
import fs from 'fs'

const title = process.argv[2].toLowerCase() //this gets the argument the user passes in with --
const Title = title
  .split('')
  .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
  .join('')

const SeederPath = `./ts/seeders/${Title}Seeder.ts`
const ModelPath = `./ts/models/${Title}.ts`

try {
  // the seeder will only be created if the model exists
  if (fs.existsSync(ModelPath)) {
    console.log(`Model ${Title} exists. Creating seeder...`)
    exec(`touch ${SeederPath} && tsc`)

    // content to be added to the seeder
    const content = `import dotenv from 'dotenv'
    dotenv.config()
    
    /* Import model */
    import ${Title} from '../models/${Title}'
    
    /* Other modules */
    import faker from 'faker'
    
    const ${Title}Seeder = (max: number): void => {
      let num = 0
      
      /* uncomment the block quote underneath, and update/edit it to create a seeder for the ${Title} model. */
      while (num < max) {
        ${Title}.build({
          /* username: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password(), */
        }).save()
    
        num++
      }
    }
    
    export default ${Title}Seeder
    /*please make sure to import this seeder into Seeder.ts, and to call it. */`

    fs.writeFile(SeederPath, content, err => {
      if (err) {
        console.error(err)
        return
      }

      console.log('File writted successfully.')
    })
  } else {
    console.log(
      `Model ${Title} does not exist. Please create it before creating a seeder with the following command:`
    )

    console.log(`npm run createModel ${Title}`)
  }
  //   if model does not exist, it will throw an error
} catch (err) {
  console.error(err)
}
