import { createConnection } from "typeorm";
import { dataSourceOptions } from "../data-source";

export async function createDatabaseIfNotExist() {
    console.log('Creating database...')

    const connectionOptions = {...dataSourceOptions, database: 'mysql'};

    try {
        const connection = await createConnection(connectionOptions as any);
        const queryRunner = connection.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.createDatabase(dataSourceOptions.database as string ?? 'problem-ms', true);
        await queryRunner.release();
        await connection.close();
        console.log('Finished database creation script')
    } catch(e) {
        console.log('Could not create database');
        console.error(e);
        process.exit(1);
    }
}