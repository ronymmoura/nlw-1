import { Request, Response } from 'express';
import knex from '@database/connection';

export class ItemsController {
  static async list (req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item) => {
      return {
        ...item,
        image_url: `http://192.168.0.2:3333/uploads/${item.image}`
      };
    });

    res.json(serializedItems);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const item = await knex('items').where({ id }).select('*').first();
    res.json(item);
  }

  static async create (req: Request, res: Response) {
    const item = req.body;
    const result = await knex('items').insert(item);
    const insertedId = result[0];
    res.json(insertedId);
  }

  static async edit (req: Request, res: Response) {
    const item = req.body;
    await knex('items').where({ id: item.id }).update(item);
    res.sendStatus(200);
  }

  static async delete (req:Request, res: Response) {
    const id = Number(req.params.id);
    await knex('items').where({ id }).del();
    res.sendStatus(200);
  }
}
