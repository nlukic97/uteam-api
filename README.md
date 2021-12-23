# UTEAM - api - Nikola Lukic

- Express API project using Typescript


## API routes:
`/*` - wildcard (any url request) - returns this JSON object:
            
    {
        status:200,
        message:'OK'
    }
---
## Development
For development, clone the repository and run:

    npm install

Next, run these two scripts to compile the typescript code and to run the nodemon server (both in watch mode).

    npm run dev:tsc
    npm run dev:server

---
## Production
On the production server, run the following command:
    
    npm run start