import { MigrationInterface, QueryRunner } from "typeorm";

export class Problem1708867290760 implements MigrationInterface {
    name = 'Problem1708867290760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`problem\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(2000) NOT NULL, \`starterCode\` varchar(2000) NOT NULL, \`constraints\` varchar(2000) NULL, \`approved\` tinyint NOT NULL DEFAULT 0, \`difficulty\` varchar(255) NOT NULL, \`creatorId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`problem\``);
    }

}
