import { MigrationInterface, QueryRunner } from "typeorm";

export class ShMigration1765594611333 implements MigrationInterface {
    name = 'ShMigration1765594611333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "external_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "google_id" text NOT NULL, "email" text NOT NULL, "first_name" text, "last_name" text, "picture" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_11fc776e0ca3573dc195670f636" UNIQUE ("external_id"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
