import { Point } from '@entities/Point';
import { getManager } from 'typeorm';

export class PointsRepository {
  repository = getManager().getRepository(Point);

  async list () {
    return await this.repository.find();
  }

  async get (id: number) {
    return await this.repository
      .createQueryBuilder()
      .leftJoinAndSelect('Point.items', 'Item')
      .where({ id })
      .getOne();
  }

  async insert (point: Point) {
    return await this.repository.save(point);
  }

  async update (point: Point) {
    return await this.repository.save(point);
  }

  async delete (id: number) {
    return await this.repository.delete(id);
  }
}
