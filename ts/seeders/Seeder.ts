/* Seeder imports */
import ProfileSeeder from './ProfileSeeder'
import UserSeeder from './UserSeeder'

const Seeder = () => {
  /* Add seeder calls here */
  UserSeeder(20)
  ProfileSeeder(19)
}

/* Running the seeder */
Seeder()
