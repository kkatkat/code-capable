import { MigrationInterface, QueryRunner } from "typeorm";

export class ProblemCreatorName1711137032524 implements MigrationInterface {
    name = 'ProblemCreatorName1711137032524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`creatorName\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`creatorName\``);
    }

}
