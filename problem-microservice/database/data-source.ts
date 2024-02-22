import { configObject } from "src/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: configObject.dbType,
    host: configObject.dbHost,
    port: configObject.dbPort,
    username: configObject.dbUsername,
    password: configObject.dbPassword,
    database: configObject.dbName,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

