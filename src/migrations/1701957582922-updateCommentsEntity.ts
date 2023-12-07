import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentsEntity1701957582922 implements MigrationInterface {
    name = 'UpdateCommentsEntity1701957582922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_9100cf44f77690b6df5cf82a5df\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`commentsId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`commentsId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_9100cf44f77690b6df5cf82a5df\` FOREIGN KEY (\`commentsId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
