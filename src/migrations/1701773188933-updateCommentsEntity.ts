import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentsEntity1701773188933 implements MigrationInterface {
    name = 'UpdateCommentsEntity1701773188933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`text\` \`text\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`text\` \`text\` varchar(255) NOT NULL`);
    }

}
