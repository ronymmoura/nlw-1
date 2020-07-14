import { Request, Response, Router } from 'express';
import { ItemsRepository } from '@src/repositories';
import { Item } from '@entities/Item';

export class ItemsController {
  static routes (): Router {
    const router = Router();

    router.get('/items', ItemsController.list);
    router.get('/items/:id', ItemsController.get);
    router.post('/items', ItemsController.create);
    router.put('/items', ItemsController.edit);
    router.delete('/items/:id', ItemsController.delete);

    return router;
  }

  static async list (req: Request, res: Response) {
    const items = await new ItemsRepository().list();

    const serializedItems = items.map((item) => {
      return {
        ...item,
        image_url: `http://192.168.0.2:3333/uploads/${item.image}`
      };
    });

    return res.json(serializedItems);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const item = await new ItemsRepository().get(id);
    return res.json(item);
  }

  static async create (req: Request, res: Response) {
    const item = req.body as Item;
    const result = await new ItemsRepository().insert(item);
    const insertedId = result.identifiers[0].id;
    return res.json(insertedId);
  }

  static async edit (req: Request, res: Response) {
    const item = req.body as Item;
    await new ItemsRepository().update(item);
    return res.sendStatus(200);
  }

  static async delete (req:Request, res: Response) {
    const id = Number(req.params.id);
    await new ItemsRepository().delete(id);
    return res.sendStatus(200);
  }
}
