import { MigrationInterface, QueryRunner } from "typeorm";

export class UserGitHubLinkedIn1711374479709 implements MigrationInterface {
    name = 'UserGitHubLinkedIn1711374479709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`gitHubUsername\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`linkedInUsername\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`linkedInUsername\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`gitHubUsername\``);
    }

}
