// src/config.ts
const BASE_URL = process.env.BUN_PUBLIC_API_URL ?? "http://localhost:8080";
export default BASE_URL;

export const ENV = process.env.BUN_PUBLIC_ENV ?? "DEV";