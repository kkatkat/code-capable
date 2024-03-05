import parseEnv from "./env";

export default () => {
    return {
        port: parseEnv(process.env.PORT, 3000),
        dbType: parseEnv(process.env.DB_TYPE),
        dbHost: parseEnv(process.env.DB_HOST),
        dbPort: parseEnv(process.env.DB_PORT),
        dbUsername: parseEnv(process.env.DB_USERNAME),
        dbPassword: parseEnv(process.env.DB_PASSWORD),
        dbName: parseEnv(process.env.DB_NAME),
        jwtPublicKey: parseEnv(process.env.JWT_PUBLIC_KEY)
    }
}