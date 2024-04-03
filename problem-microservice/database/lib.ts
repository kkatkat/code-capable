import { DataSource } from "typeorm";
import { dataSourceOptions } from "./data-source";


export async function runMigrations() {
    console.log('Running migrations...');
    const dataSource = new DataSource(dataSourceOptions);

    await dataSource.initialize();
    await dataSource.runMigrations({
        transaction: 'each',
        fake: false,
    })
    await dataSource.destroy();
    console.log('Migrations finished');
}