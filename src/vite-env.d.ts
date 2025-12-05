// Fixed errors:
// 1. Removed "/// <reference types="vite/client" />" as the type definition file could not be found.
// 2. Replaced conflicting "declare var process" with a NodeJS namespace extension to properly type process.env.API_KEY.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
