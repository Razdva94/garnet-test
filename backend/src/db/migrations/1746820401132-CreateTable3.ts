import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable31746820401132 implements MigrationInterface {
    name = 'CreateTable31746820401132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    }

}
