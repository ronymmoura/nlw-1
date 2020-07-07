import { Request, Response } from 'express';
import { ItemsRepository } from '@src/repositories';
import { Item } from '@entities/Item';

export class ItemsController {
  static async list (req: Request, res: Response) {
    const items = await new ItemsRepository().list();

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
    const item = await new ItemsRepository().get(id);
    res.json(item);
  }

  static async create (req: Request, res: Response) {
    const item = req.body as Item;
    const result = await new ItemsRepository().insert(item);
    const insertedId = result.identifiers[0].id;
    res.json(insertedId);
  }

  static async edit (req: Request, res: Response) {
    const item = req.body;
    await new ItemsRepository().update(item);
    res.sendStatus(200);
  }

  static async delete (req:Request, res: Response) {
    const id = Number(req.params.id);
    await new ItemsRepository().delete(id);
    res.sendStatus(200);
  }
}
