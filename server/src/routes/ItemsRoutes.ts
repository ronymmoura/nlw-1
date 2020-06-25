import express from 'express';
import { ItemsController } from '@controllers/Items';

const routes = express.Router();

routes.get('/items', ItemsController.list);
routes.get('/items/:id', ItemsController.get);
routes.post('/items', ItemsController.create);
routes.put('/items', ItemsController.edit);
routes.delete('/items/:id', ItemsController.delete);

export const ItemsRoutes = routes;
