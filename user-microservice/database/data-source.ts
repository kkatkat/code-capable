import config from "src/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

const cfg = config();

export const dataSourceOptions: DataSourceOptions = {
    type: cfg.dbType,
    host: cfg.dbHost,
    port: cfg.dbPort,
    username: cfg.dbUsername,
    password: cfg.dbPassword,
    database: cfg.dbName,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

