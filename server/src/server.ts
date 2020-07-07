import app from './app';
import { createConnection } from 'typeorm';

const PORT = process.env.PORT || 3333;

createConnection();

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});
