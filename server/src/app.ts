import 'reflect-metadata';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

import packageJson from '../package.json';

import { ItemsController } from '@controllers/Items';
import { PointsController } from '@controllers/Points';

const app = express();
app.use(cors());
app.use(express.json());
app.use(errors());

app.use(ItemsController.routes());
app.use(PointsController.routes());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json(packageJson.version);
});

export default app;
