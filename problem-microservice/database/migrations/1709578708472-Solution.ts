import { MigrationInterface, QueryRunner } from "typeorm";

export class Solution1709578708472 implements MigrationInterface {
    name = 'Solution1709578708472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`solution\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`code\` varchar(5000) NOT NULL, \`problemId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_1600724ccc854e519aa3a46958b\` FOREIGN KEY (\`problemId\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_1600724ccc854e519aa3a46958b\``);
        await queryRunner.query(`DROP TABLE \`solution\``);
    }

}
