//variables de entorno de la pagina

import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT={
    MONGO_URI: process.env.MONGO_URI,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_USER: process.env.EMAIL_USER || '',
    SECRET_KEY: process.env.SECRET_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_DB_CONNECTION_STR: process.env.MONGO_DB_CONNECTION_STR,
    MONGO_DB_DATABASE: process.env.MONGO_DB_DATABASE
}

export default ENVIRONMENT