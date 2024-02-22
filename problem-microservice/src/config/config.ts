import parseEnv from "./env";

export default () => ({
    port: parseEnv(process.env.PORT, 3000)
})