import { MigrationInterface, QueryRunner } from "typeorm";

export class SomeHandle1701360059649 implements MigrationInterface {
    name = 'SomeHandle1701360059649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`comments\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`commentsCount\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`commentsCount\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`comments\` varchar(255) NULL`);
    }

}
