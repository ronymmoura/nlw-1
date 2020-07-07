import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { Item } from '@entities/Item';
import { ItemsSeed } from '@database/seeds/ItemsSeed';

export class SeedItems1594084144643 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await getRepository(Item).save(ItemsSeed);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
  }
}
