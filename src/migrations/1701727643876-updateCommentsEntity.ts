import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentsEntity1701727643876 implements MigrationInterface {
    name = 'UpdateCommentsEntity1701727643876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`commentsCount\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`commentsCount\``);
    }

}
