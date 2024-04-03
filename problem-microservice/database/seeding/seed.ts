import { dataSourceOptions } from "database/data-source";
import { Problem } from "src/modules/problem/problem.entity";
import { problemData } from "./problemData";
import { DataSource } from "typeorm";
import { UnitTest } from "src/modules/unit-test/unit-test.entity";
import { Solution } from "src/modules/solution/solution.entity";

async function seed() {
    const options = {...dataSourceOptions};
    options.entities = [Problem, UnitTest, Solution];

    const dataSource = new DataSource(options);

    try {
        await dataSource.initialize();
    } catch (e) {
        console.log('Could not initialize typeorm')
        throw e;
    }

    console.log('Start seeding');
    await seedProblems(dataSource);
    console.log('Seeding finished');

    await dataSource.close();
}

async function seedProblems(dataSource: DataSource) {
    const problemRepo = dataSource.getRepository(Problem);

    await problemRepo.save(problemData);
    console.log('Problems seeded', problemData.length)
}

seed();