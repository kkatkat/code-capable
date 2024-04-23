import parseEnv from "./env";

export default () => {
    return {
        port: parseEnv(process.env.PORT, 3000),
        jwtPublicKey: parseEnv(process.env.JWT_PUBLIC_KEY),
        rmqHost: parseEnv(process.env.RABBITMQ_HOST),
        rmqPort: parseEnv(process.env.RABBITMQ_PORT),
        useJudge: parseEnv(process.env.USE_JUDGE)
    }
}