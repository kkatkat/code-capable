import { MigrationInterface, QueryRunner } from "typeorm";

export class UnitTest1709111980023 implements MigrationInterface {
    name = 'UnitTest1709111980023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`unit_test\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(1000) NOT NULL, \`visible\` tinyint NOT NULL DEFAULT 1, \`problemId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`unit_test\` ADD CONSTRAINT \`FK_81a1cea57b8e09fb460a8671837\` FOREIGN KEY (\`problemId\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`unit_test\` DROP FOREIGN KEY \`FK_81a1cea57b8e09fb460a8671837\``);
        await queryRunner.query(`DROP TABLE \`unit_test\``);
    }

}
