import { Request, Response, Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { ItemsRepository } from '@repositories/ItemsRepository';
import { PointsRepository } from '@repositories/PointsRepository';
import { Point } from '@entities/Point';
import { Item } from '@entities/Item';

import multer from 'multer';
import multerConfig from '@config/multer';

const upload = multer(multerConfig);

export class PointsController {
  static routes (): Router {
    const router = Router();

    router.get('/points', PointsController.list);
    router.get('/points/:id', PointsController.get);

    router.post(
      '/points',
      upload.single('image'),
      PointsController.createValidations(),
      PointsController.create
    );

    router.put('/points',
      upload.single('image'),
      PointsController.editValidations(),
      PointsController.edit);
    router.delete('/points/:id', PointsController.delete);

    return router;
  }

  static async list (req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await new PointsRepository().list();

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
    const point = await new PointsRepository().get(id);

    if (!point) return res.status(404).json({ message: 'Point not found.' });

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.2:3333/uploads/${point.image}`
    };

    res.json(serializedPoint);
  }

  static async create (req: Request, res: Response) {
    try {
      const { body } = req;
      const itemsIds = body.items.trim();
      delete body.items;

      var splitedItems = String(itemsIds).split(',');
      var filteredItems = [];

      for (const item of splitedItems) {
        const value = Number(item.trim());
        if (!Number.isNaN(value) && item.trim() !== '')
          filteredItems.push(value);
      }

      if (filteredItems.length === 0)
        throw new Error('É necessário cadastrar ao menos um item válido');

      const itemsRepository = new ItemsRepository();
      var items: Item[] = [];

      for (const itemId of filteredItems) {
        const item = await itemsRepository.get(itemId);
        items.push(item);
      }

      var point: Point = {
        ...body,
        image: `${req.file.filename}`,
        items
      };

      const result = await new PointsRepository().insert(point);

      const insertedId = result.id;
      res.json(insertedId);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  static async edit (req: Request, res: Response) {
    const { body } = req;
    const itemsIds = body.items;
    delete body.items;

    const parsedItems = String(itemsIds)
      .split(',')
      .map((item) => Number(item.trim()));

    const itemsRepository = new ItemsRepository();
    var items: Item[] = [];

    for (const itemId of parsedItems) {
      const item = await itemsRepository.get(itemId);
      items.push(item);
    }

    var point: Point = {
      ...body,
      image: `${req.file.filename}`,
      items
    };

    await new PointsRepository().update(point);

    res.sendStatus(200);
  }

  static async delete (req: Request, res: Response) {
    const id = Number(req.params.id);
    await new PointsRepository().delete(id);

    res.sendStatus(200);
  }

  static createValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          name: Joi.string()
            .required()
            .messages({
              'string.required': 'Name is required'
            }),
          email: Joi.string()
            .required()
            .email()
            .messages({
              'string.required': 'E-mail is required',
              'string.email': 'E-mail is invalid'
            }),
          whatsapp: Joi.string()
            .required()
            .messages({
              'string.required': 'Whatsapp is required'
            }),
          latitude: Joi.number()
            .required()
            .messages({
              'string.required': 'Latitude is required'
            }),
          longitude: Joi.number()
            .required()
            .messages({
              'string.required': 'Longitude is required'
            }),
          city: Joi.string()
            .required()
            .messages({
              'string.required': 'City is required'
            }),
          uf: Joi.string()
            .required()
            .max(2)
            .messages({
              'string.required': 'UF is required',
              'string.max': 'UF length must be 2 characters'
            }),
          items: Joi.string()
            .required()
            .messages({
              'string.required': 'Items is required'
            })
        })
      },
      {
        abortEarly: false
      }
    );
  }

  static editValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          id: Joi.number()
            .required()
            .messages({
              'string.required': 'ID is required'
            }),
          name: Joi.string()
            .required()
            .messages({
              'string.required': 'Name is required'
            }),
          email: Joi.string()
            .required()
            .email()
            .messages({
              'string.required': 'E-mail is required',
              'string.email': 'E-mail is invalid'
            }),
          whatsapp: Joi.string()
            .required()
            .messages({
              'string.required': 'Whatsapp is required'
            }),
          latitude: Joi.number()
            .required()
            .messages({
              'string.required': 'Latitude is required'
            }),
          longitude: Joi.number()
            .required()
            .messages({
              'string.required': 'Longitude is required'
            }),
          city: Joi.string()
            .required()
            .messages({
              'string.required': 'City is required'
            }),
          uf: Joi.string()
            .required()
            .max(2)
            .messages({
              'string.required': 'UF is required',
              'string.max': 'UF length must be 2 characters'
            }),
          items: Joi.string()
            .required()
            .messages({
              'string.required': 'Items is required'
            })
        })
      },
      {
        abortEarly: false
      }
    );
  }
}
