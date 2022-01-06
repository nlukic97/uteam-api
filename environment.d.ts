/**
 * Typescript was underlining the process.env variable imports in App.ts
 * This solved based on this stack overflow question:
 * https://stackoverflow.com/a/53981706
 *
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string
      DB_NAME: string
      DB_USER: string
      DB_PASS: string
      DB_HOST: string
      DB_DIALECT: Dialect | undefined,
      ACCESS_TOKEN_SECRET: string
    }
  }

  namespace Express {
    interface Request {
      user: JwtPayload | undefined //source: https://stackoverflow.com/questions/64520849/express-jwt-middleware-typescript-types-issue
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
