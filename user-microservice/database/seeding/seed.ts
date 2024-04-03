import { dataSourceOptions } from "database/data-source";
import { User } from "src/modules/user/user.entity";
import { DataSource } from "typeorm";
import { userData } from "./userData";

async function seed() {
    const options = {...dataSourceOptions};
    options.entities = [User];

    const dataSource = new DataSource(options);

    try {
        await dataSource.initialize();
    } catch (e) {
        console.log('Could not initialize typeorm')
        throw e;
    }

    console.log('Start seeding');
    await seedUsers(dataSource);
    console.log('Seeding finished');

    await dataSource.close();
}

async function seedUsers(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(User);

    await userRepo.save(userData);
    console.log('Users seeded', userData.length)
}

seed();