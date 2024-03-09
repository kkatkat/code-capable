import parseEnv from "./env";

export default () => {
    return {
        port: parseEnv(process.env.PORT, 3000),
        rmqHost: parseEnv(process.env.RABBITMQ_HOST),
        rmqPort: parseEnv(process.env.RABBITMQ_PORT),
    }
}