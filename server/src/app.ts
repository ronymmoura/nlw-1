import express from 'express';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

import packageJson from '../package.json';

import { ItemsRoutes, PointsRoutes } from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(errors());

app.use(ItemsRoutes);
app.use(PointsRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json(packageJson.version);
});

export default app;
