import { exec } from 'child_process'
import pluralize from 'pluralize'
import fs from 'fs'

const title = process.argv[2].toLowerCase() //this gets the argument the user passes in with --
const Title = title
  .split('')
  .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
  .join('')

const ModelPath = `./ts/models/${Title}.ts`

exec(`touch ${ModelPath} && tsc`)

// content to be added to the seeder
const content = `import { DataTypes } from 'sequelize'
import db from '../config/database'

// Uncomment the block comment underneath, and define your model.
/*
const ${Title} = db.define(
  '${Title}',  
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // freezeTableName: true, //means that the table for a User model must be named 'User'
    tableName: '${pluralize.plural(title)}', //providing table name directly
  }
  )

  ${Title}.sync({force:false})
  
  export default ${Title}
*/
`

fs.writeFile(ModelPath, content, err => {
  if (err) {
    console.error(err)
    return
  }

  console.log('File writted successfully.')

  if (process.argv[3].toLowerCase() === 'seeder') {
    exec(`tsc && npm run createSeeder ${Title} && tsc`)
  } else if (process.argv[3].toLowerCase() === 'controller') {
    exec(`tsc && npm run createController ${Title} && tsc`)
  }
})
