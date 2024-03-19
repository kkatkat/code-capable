import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserNameToSolution1710856842314 implements MigrationInterface {
    name = 'AddUserNameToSolution1710856842314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`solution\` ADD \`userName\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`userName\``);
    }

}
