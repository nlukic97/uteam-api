# UTEAM - api - Nikola Lukic

- Express API project using Typescript, Sequalize ORM, and MySQL.

---

## API routes:

### GET Routes

| Endpoint          | Type | Description                                                                                              |
| ----------------- | ---- | -------------------------------------------------------------------------------------------------------- |
| `/countAllUsers`  | GET  | Returns the number of rows in the `users` table. Authentication bearer token is required for this route. |
| `/profiles `      | GET  | Returns a list of profiles (limit set to 20).                                                            |
| `/profiles/{id}`  | GET  | Returns a profile by {id} url parameter.                                                                 |
| `/companies`      | GET  | Returns a list of companies (limit set to 20)parameter.                                                  |
| `/companies/{id}` | GET  | Returns a company by {id} url parameter.                                                                 |

### POST Routes

| Endpoint     | Type | Expected request body                                                                                                                                        | Description                                                                                                                                                                          |
| ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/register`  | POST | { `username`: string, `email`: string, `password`: string, `profileName?`: string `profilePhoto`?: string, `companyLogo`?: string, `companyName`?: string, } | Used to insert a new row into the tables `users`, `companies` and `profiles`.                                                                                                        |
| `/profiles`  | POST | { `name`: string, `profilePhoto`: string, `user`: number, `company`: number }                                                                                | Used to insert a new row into the `profiles` table.                                                                                                                                  |
| `/login`     | POST | { `name`: string, `password`: string}                                                                                                                        | Used to authenticate a user. The `name` field for the request body can either be an email or a username of an existing user.                                                         |
| `/companies` | POST | { `logo`: string, `name`: string}                                                                                                                            | Used to insert a new row into the `companies` table. The field _slug_ is generated from the name field. The field _companyOwner_ is from the id of the user who created the company. |

### PUT Routes

- `Please note:` that only a user who's id is present in the foreignKey of a row targeted by these PUT methods can make altering changes to them.

| Endpoint          | Type | Expected request body                                            | Description                                                                                                                                                          |
| ----------------- | ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/profiles/{id}`  | PUT  | { `name`?: string, `profilePhoto`?: string, `company`?: number } | Used to updated any or all columns of a specific row (with an id of `{id}`) in the `profiles` table. Field user cannot be updated.                                   |
| `/companies/{id}` | PUT  | { `logo`?: string, `name`?: string}                              | Used to updated any or all columns of a specific row (with an id of `{id}`) in the `companies` table. The field _slug_ is created automatically from the name field. |

### DELETE Routes

| Endpoint          | Type   | Expected request body | Description                                                                             |
| ----------------- | ------ | --------------------- | --------------------------------------------------------------------------------------- |
| `/profiles/{id}`  | DELETE | /                     | Used to delete a row in the `profiles` table based on the supplied {id} url parameter.  |
| `/companies/{id}` | DELETE | /                     | Used to delete a row in the `companies` table based on the supplied {id} url parameter. |

---

## Requirements

- `MySQL server 5.7.33` (higher versions should also be compatible)
- `NodeJS v.16.13.0`

---

## Development

### Please install the following plugins on your vsCode:

- `Prettier - Code formatter`
- `ESlint`

### Next, install a `MySQL 5.7` server and create a database with a name of your choice.

### Next, clone this repository and run the following command:

    cp .env.example .env

... which will create a `.env` file. Open it and insert the required environemnt variables (port and database connection parameters).

Make sure to also add a value to the "ACCESS_TOKEN_SECRET" .env parameter with a random string of bytes (leaving it empty will cause errors upon user registration). You can get this string by running the following commands in a terminal:

        node
        require('crypto').randomBytes(64).toString('hex')

### Next, run the following command in your command line:

    npm install

### `Last step`: run these two scripts (preferably in different cmd windows) to compile the typescript code and to run the nodemon server (both will be in watch mode).

    npm run dev:tsc
    npm run dev:server

---

## Production

Perform all the steps not including the `Last step`, but instead run the following command:

    npm run start

You also might need to leave the PORT variable in `.env` empty when deploying this app (such as hosting your server on Heroku, for example).

---

## Models

### User

- id
- username
- email
- password
- role ---> `'company-user'`|`'company-admin'`|`'superadmin'` (default: superadmin).

### Profile

- id
- status ---> `'pending'`|`'published'` (default: pending).
- name
- profilePhoto
- user ---> `foreignKey`
- company ---> `foreignKey`

### Company

- id
- logo
- name
- slug
- companyOwner ---> `foreignKey`

---

## Associations

- `User` to `Profile` = One to One
- `Profile` to `Company` = One to Many _(one Company has many Profiles, one Profile belongs to one Company)_
- `User` to `Company` = One to Many _(one User has many Companies, one Company belongs to one User)_

Note:

- _one company could have many users `through` the Profile table - still not implemented._
