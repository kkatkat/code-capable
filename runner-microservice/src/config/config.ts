import parseEnv from "./env";

export default () => {
    return {
        port: parseEnv(process.env.PORT, 3000),
    }
}