import { Sequelize } from 'sequelize'

const sequaleze = new Sequelize(
  process.env.DB_NAME, //check the 'environment.d.ts' file in the project root"
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
)

// sequaleze.sync({ force: false }) //uncommented this because the auto seeder didn't work with it

export default sequaleze
