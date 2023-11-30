import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateComments1701328082401 implements MigrationInterface {
    name = 'CreateComments1701328082401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`comments\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`comments\``);
    }

}
