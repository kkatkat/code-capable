import { dataSourceOptions } from "database/data-source";
import { Problem } from "src/modules/problem/problem.entity";
import { problemData } from "./problemData";
import { DataSource } from "typeorm";
import { UnitTest } from "src/modules/unit-test/unit-test.entity";
import { Solution } from "src/modules/solution/solution.entity";

export async function seed() {
    const options = {...dataSourceOptions};
    options.entities = [Problem, UnitTest, Solution];

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
        await seedProblems(dataSource);
    } catch (e) {
        console.log('Error while seeding');
        console.error(e);
        process.exit(1);
    }

    console.log('Seeding finished');

    await dataSource.close();
}

async function seedProblems(dataSource: DataSource) {
    const problemRepo = dataSource.getRepository(Problem);
    const count = await problemRepo.count();

    if (count > 0) {
        console.log('- Not seeding problems, table is not empty');
        return;
    }

    await problemRepo.save(problemData);
    console.log('- Problems seeded', problemData.length)
}