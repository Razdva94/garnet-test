import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable21743775797101 implements MigrationInterface {
  name = 'CreateTable21743775797101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActive1" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isnotActive1" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isnotActive1"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive1"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
  }
}
