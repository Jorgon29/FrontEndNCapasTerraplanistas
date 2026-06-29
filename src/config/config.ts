// src/config.ts
// Bun injects BUN_PUBLIC_* vars at serve time via bunfig.toml

const BASE_URL = "/api";  // Nginx proxies /api/ to backend
const FRONTEND_REDIRECT_URI = "http://localhost:3000/auth/callback";
const ENV = "DEV";
const STRIPE_PUBLISHABLE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx";

export default BASE_URL;
export { FRONTEND_REDIRECT_URI, ENV, STRIPE_PUBLISHABLE_KEY };
