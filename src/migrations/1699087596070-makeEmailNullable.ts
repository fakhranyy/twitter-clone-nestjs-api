import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeEmailNullable1699087596070 implements MigrationInterface {
    name = 'MakeEmailNullable1699087596070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
    }

}
