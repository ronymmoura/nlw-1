import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDatabase1594083839508 implements MigrationInterface {
    name = 'InitialDatabase1594083839508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "image" varchar NOT NULL, "title" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "point" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "image" varchar NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "whatsapp" varchar NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "city" varchar NOT NULL, "uf" varchar(2) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "point_items" ("pointId" integer NOT NULL, "itemId" integer NOT NULL, PRIMARY KEY ("pointId", "itemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3cdecf4681fb1a41a280d9440" ON "point_items" ("pointId") `);
        await queryRunner.query(`CREATE INDEX "IDX_212e93f8ad7739e4a058624906" ON "point_items" ("itemId") `);
        await queryRunner.query(`DROP INDEX "IDX_a3cdecf4681fb1a41a280d9440"`);
        await queryRunner.query(`DROP INDEX "IDX_212e93f8ad7739e4a058624906"`);
        await queryRunner.query(`CREATE TABLE "temporary_point_items" ("pointId" integer NOT NULL, "itemId" integer NOT NULL, CONSTRAINT "FK_a3cdecf4681fb1a41a280d94401" FOREIGN KEY ("pointId") REFERENCES "point" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_212e93f8ad7739e4a058624906b" FOREIGN KEY ("itemId") REFERENCES "item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("pointId", "itemId"))`);
        await queryRunner.query(`INSERT INTO "temporary_point_items"("pointId", "itemId") SELECT "pointId", "itemId" FROM "point_items"`);
        await queryRunner.query(`DROP TABLE "point_items"`);
        await queryRunner.query(`ALTER TABLE "temporary_point_items" RENAME TO "point_items"`);
        await queryRunner.query(`CREATE INDEX "IDX_a3cdecf4681fb1a41a280d9440" ON "point_items" ("pointId") `);
        await queryRunner.query(`CREATE INDEX "IDX_212e93f8ad7739e4a058624906" ON "point_items" ("itemId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_212e93f8ad7739e4a058624906"`);
        await queryRunner.query(`DROP INDEX "IDX_a3cdecf4681fb1a41a280d9440"`);
        await queryRunner.query(`ALTER TABLE "point_items" RENAME TO "temporary_point_items"`);
        await queryRunner.query(`CREATE TABLE "point_items" ("pointId" integer NOT NULL, "itemId" integer NOT NULL, PRIMARY KEY ("pointId", "itemId"))`);
        await queryRunner.query(`INSERT INTO "point_items"("pointId", "itemId") SELECT "pointId", "itemId" FROM "temporary_point_items"`);
        await queryRunner.query(`DROP TABLE "temporary_point_items"`);
        await queryRunner.query(`CREATE INDEX "IDX_212e93f8ad7739e4a058624906" ON "point_items" ("itemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3cdecf4681fb1a41a280d9440" ON "point_items" ("pointId") `);
        await queryRunner.query(`DROP INDEX "IDX_212e93f8ad7739e4a058624906"`);
        await queryRunner.query(`DROP INDEX "IDX_a3cdecf4681fb1a41a280d9440"`);
        await queryRunner.query(`DROP TABLE "point_items"`);
        await queryRunner.query(`DROP TABLE "point"`);
        await queryRunner.query(`DROP TABLE "item"`);
    }

}
