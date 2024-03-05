import { MigrationInterface, QueryRunner } from "typeorm";

export class User1709643924664 implements MigrationInterface {
    name = 'User1709643924664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`pfp\` varchar(255) NULL, \`provider\` varchar(255) NULL, \`accountConfirmed\` tinyint NULL DEFAULT 0, \`acceptedTermsAndConditions\` tinyint NOT NULL DEFAULT 0, \`confirmationCode\` varchar(255) NULL, \`bio\` varchar(1000) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
