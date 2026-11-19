import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertTagsAndTakenToArray1795105157102
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "films" ALTER COLUMN "tags" TYPE text[] USING string_to_array(tags, ',')`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ALTER COLUMN "taken" TYPE text[] USING string_to_array(taken, ',')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "films" ALTER COLUMN "tags" TYPE text USING array_to_string(tags, ',')`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ALTER COLUMN "taken" TYPE text USING array_to_string(taken, ',')`,
    );
  }
}
