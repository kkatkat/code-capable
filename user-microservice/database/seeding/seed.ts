import { dataSourceOptions } from "database/data-source";
import { User } from "src/modules/user/user.entity";
import { DataSource } from "typeorm";
import { userData } from "./userData";

export async function seed() {
    const options = {...dataSourceOptions};
    options.entities = [User];

    const dataSource = new DataSource(options);

    try {
        await dataSource.initialize();
    } catch (e) {
        console.log('Could not initialize typeorm')
        console.error(e);
        process.exit(1);
    }

    console.log('Start seeding');
    try {
        await seedUsers(dataSource);
    } catch (e) {
        console.log('Error while seeding');
        console.error(e);
        process.exit(1);
    }
    
    console.log('Seeding finished');

    await dataSource.close();
}

async function seedUsers(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(User);
    const count = await userRepo.count();

    if (count > 0) {
        console.log('- Not seeding users, table is not empty');
        return;
    }

    await userRepo.save(userData);
    console.log('- Users seeded', userData.length)
}