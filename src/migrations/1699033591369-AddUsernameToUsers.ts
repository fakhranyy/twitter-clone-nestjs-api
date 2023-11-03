import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1699033591369 implements MigrationInterface {
  name = 'AddUsernameToUsers1699033591369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`username\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
  }
}
