import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable51746820563663 implements MigrationInterface {
    name = 'CreateTable51746820563663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer`);
    }

}
