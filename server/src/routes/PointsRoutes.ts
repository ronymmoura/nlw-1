import express from 'express';

import multer from 'multer';
import multerConfig from '@config/multer';

import { PointController } from '@controllers/Points';

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/points', PointController.list);
routes.get('/points/:id', PointController.get);

routes.post(
  '/points',
  upload.single('image'),
  PointController.createValidations(),
  PointController.create
);

routes.put('/points', PointController.edit);
routes.delete('/points/:id', PointController.delete);

export const PointsRoutes = routes;
