import dotenv from 'dotenv'
    dotenv.config()
    
    /* Import model */
    import Company from '../models/Company'
    
    /* Other modules */
    import faker from 'faker'
    
    const CompanySeeder = (max: number): void => {
      let num = 0
      
      /* uncomment the block quote underneath, and update/edit it to create a seeder for the Company model. */
      while (num < max) {
        Company.build({
          logo: faker.system.directoryPath(),
          name: faker.internet.userName(),
          slug:faker.name.findName()
        }).save()
    
        num++
      }
    }
    
    export default CompanySeeder
    /*please make sure to import this seeder into Seeder.ts, and to call it. */