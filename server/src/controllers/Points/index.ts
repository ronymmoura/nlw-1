import knex from '@database/connection';
import { Request, Response } from 'express';
import { celebrate, Joi } from 'celebrate';

export class PointController {
  static async list (req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('pointItems', { 'points.id': 'pointItems.pointId' })
      .whereIn('pointItems.itemId', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.0.2:3333/uploads/${point.image}`
      };
    });

    res.json(serializedPoints);
  }

  static async get (req: Request, res) {
    const id = Number(req.params.id);
    const point = await knex('points').where({ id }).first();

    if (!point) return res.status(400).json({ message: 'Point not found.' });

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.2:3333/uploads/${point.image}`
    };

    const items = await knex('points')
      .join('pointItems', { 'points.id': 'pointItems.pointId' })
      .join('items', { 'items.id': 'pointItems.itemId' })
      .where('points.id', id)
      .select('items.*');

    res.json({ point: serializedPoint, items });
  }

  static createValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required().email(),
          whatsapp: Joi.string().required(),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          city: Joi.string().required(),
          uf: Joi.string().required().max(2),
          items: Joi.string().required()
        })
      },
      {
        abortEarly: false
      }
    );
  }

  static async create (req: Request, res: Response) {
    const trx = await knex.transaction();

    try {
      const point = req.body;
      const items = point.items;
      delete point.items;

      if (!items || items.length === 0)
        throw new Error('É necessário incluir ao menos um item.');

      point.image = `${req.file.filename}`;
      const insertedPoints = await trx('points').insert(point);
      const insertedId = insertedPoints[0];

      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((itemId: number) => {
          return {
            pointId: insertedId,
            itemId
          };
        });

      await trx('pointItems').insert(pointItems);

      await trx.commit();

      res.json(insertedId);
    } catch (err) {
      await trx.rollback();
      res.status(500).send(err.message);
    }
  }

  static async edit (req: Request, res: Response) {
    const trx = await knex.transaction();
    try {
      const point = req.body;
      const items = point.items;
      delete point.items;

      await trx('points').where({ id: point.id }).update(point);
      await trx('pointItems').where({ pointId: point.id }).del();

      const pointItems = items.map((itemId: any) => {
        return {
          pointId: point.id,
          itemId
        };
      });

      await trx('pointItems').insert(pointItems);

      await trx.commit();

      res.sendStatus(200);
    } catch (err) {
      await trx.rollback();
      res.status(500).json(err.message);
    }
  }

  static async delete (req: Request, res: Response) {
    const trx = await knex.transaction();
    try {
      const id = Number(req.params.id);
      await trx('points').where({ id }).del();
      await trx('pointItems').where({ pointId: id }).del();

      await trx.commit();
      res.sendStatus(200);
    } catch (err) {
      await trx.rollback();
      res.status(500).json(err.message);
    }
  }
}
