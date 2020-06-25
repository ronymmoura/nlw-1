import app from '@src/app';
import supertest from 'supertest';
import packageJson from '@root/package.json';

const request = supertest(app);

describe('app', () => {
  test('it should be ok', async (done) => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(packageJson.version);
    done();
  });
});
