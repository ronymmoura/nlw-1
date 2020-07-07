import { createConnection, getConnection } from 'typeorm';

const connection = {
  async create () {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: ['src/entities/**/*.ts'],
      dropSchema: true,
      synchronize: true,
      logging: false
    });
  },

  async close () {
    await getConnection().close();
  }
};
export default connection;
