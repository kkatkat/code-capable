import parseEnv from "./env";

export const configObject = {
    port: parseEnv(process.env.PORT, 3000),
    dbType: parseEnv(process.env.DB_TYPE, 'mysql'),
    dbHost: parseEnv(process.env.DB_HOST, 'localhost'),
    dbPort: parseEnv(process.env.DB_PORT, 3306),
    dbUsername: parseEnv(process.env.DB_USERNAME, 'root'),
    dbPassword: parseEnv(process.env.DB_PASSWORD, 'root'),
    dbName: parseEnv(process.env.DB_NAME, 'problem-ms')
}

export default () => (configObject)