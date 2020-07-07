import { Item } from '@entities/Item';
import { getManager } from 'typeorm';

export class ItemsRepository {
  repository = getManager().getRepository(Item);

  async list () {
    return await this.repository.find();
  }

  async get (id: number): Promise<Item> {
    return await this.repository.findOne(id);
  }

  async insert (item: Item) {
    return this.repository.insert(item);
  }

  async update (item: Item) {
    return await this.repository.update(item.id, item);
  }

  async delete (id: number) {
    return await this.repository.delete(id);
  }
}
