/* Seeder imports */
import CompanySeeder from './CompanySeeder'
import ProfileSeeder from './ProfileSeeder'
import UserSeeder from './UserSeeder'


/* *** PLEASE NOTE*** */
/** 
 * - Server must be running when you try to seed the database.
 * - Please seed all tables that do not contain any foreign keys.
 * - After this, you may seed all tables which contain foreign keys.
*/

const Seeder = () => {
  /* Add seeder calls here */
  UserSeeder(20)
  CompanySeeder(20)
  ProfileSeeder(19)
}

/* Running the seeder */
Seeder()
