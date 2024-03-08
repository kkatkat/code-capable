import { MigrationInterface, QueryRunner } from "typeorm";

export class VarcharToText1709924429358 implements MigrationInterface {
    name = 'VarcharToText1709924429358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`solution\` ADD \`code\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`starterCode\``);
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`starterCode\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`constraints\``);
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`constraints\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`unit_test\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`unit_test\` ADD \`code\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`unit_test\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`unit_test\` ADD \`code\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`constraints\``);
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`constraints\` varchar(2000) NULL`);
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`starterCode\``);
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`starterCode\` varchar(2000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`problem\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`problem\` ADD \`description\` varchar(2000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`solution\` ADD \`code\` varchar(5000) NOT NULL`);
    }

}
