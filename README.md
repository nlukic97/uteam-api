# UTEAM - api - Nikola Lukic

- Express API project using Typescript, Sequalize ORM, and MySQL.

---

## API routes:

### GET Routes

| Endpoint       | Type | Description                                             |
| -------------- | ---- | ------------------------------------------------------- |
| `/getAllUsers` | GET  | Returns the number of rows in the `users` table.        |
| `/* `          | GET  | Wildcard route. Returns an object containing a message. |

### POST Routes

| Endpoint         | Type | Expected request body                                       | Description                                      |
| ---------------- | ---- | ----------------------------------------------------------- | ------------------------------------------------ |
| `/insertNewUser` | POST | { `username`: string, `email`: string, `password`: string } | Used to insert a new row into the `users` table. |

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

### Next, run the following command:

    cp .env.example .env

... which will create a `.env` file. Open it and insert the required environemnt variables (port and database connection parameters).

### Next, clone the repository, open it in the command line and run:

    npm install

### `Last step`: run these two scripts (preferably in different cmd windows) to compile the typescript code and to run the nodemon server (both will be in watch mode).

    npm run dev:tsc
    npm run dev:server

---

## Production

Perform all the steps not including the `Last step`, but instead run the following command:

    npm run start

You also might need to leave the PORT variable in `.env` empty (such as hosting your server on Heroku, for example).

---

## Models

- User
  - username
  - email
  - password
