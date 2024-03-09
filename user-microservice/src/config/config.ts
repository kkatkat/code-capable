import parseEnv from "./env";

export default () => {
    return {
        port: parseEnv(process.env.PORT, 3001),
        dbType: parseEnv(process.env.DB_TYPE),
        dbHost: parseEnv(process.env.DB_HOST),
        dbPort: parseEnv(process.env.DB_PORT),
        dbUsername: parseEnv(process.env.DB_USERNAME),
        dbPassword: parseEnv(process.env.DB_PASSWORD),
        dbName: parseEnv(process.env.DB_NAME),
        jwtPrivateKey: parseEnv(process.env.JWT_PRIVATE_KEY),
        jwtPublicKey: parseEnv(process.env.JWT_PUBLIC_KEY),
        rmqHost: parseEnv(process.env.RABBITMQ_HOST),
        rmqPort: parseEnv(process.env.RABBITMQ_PORT),
    }
}