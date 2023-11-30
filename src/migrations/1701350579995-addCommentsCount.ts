import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsCount1701350579995 implements MigrationInterface {
    name = 'AddCommentsCount1701350579995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`commentsCount\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`commentsCount\``);
    }

}
