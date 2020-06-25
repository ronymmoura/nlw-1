import app from '@src/app';
import supertest from 'supertest';
import path from 'path';

const request = supertest(app);

const mockData = {
  name: 'Test',
  email: 'ronymmoura@gmail.com',
  whatsapp: '5561999999349',
  latitude: -1,
  longitude: -1,
  city: 'Brasília',
  uf: 'DF',
  items: '1,2,4'
};

var mockDataID = 0;

describe('PointsController', () => {
  test('it should create a new point', async (done) => {
    const res = await request.post('/points')
      .attach('image', path.join(__dirname, 'imageTest.jpg'))
      .field('name', mockData.name)
      .field('email', mockData.email)
      .field('whatsapp', mockData.whatsapp)
      .field('latitude', String(mockData.latitude))
      .field('longitude', String(mockData.longitude))
      .field('city', mockData.city)
      .field('uf', mockData.uf)
      .field('items', mockData.items);

    mockDataID = res.body;

    expect(res.status).toBe(200);
    expect(mockDataID > 0).toBeTruthy();

    done();
  });

  test('it should list points', async (done) => {
    const res = await request.get('/points').query({
      city: mockData.city,
      uf: mockData.uf,
      items: mockData.items
    });

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[res.body.length - 1].id).toEqual(mockDataID);

    done();
  });

  test('it should get point by id', async (done) => {
    const res = await request.get(`/points/${mockDataID}`);

    const { point, items } = res.body;
    const serializedItems = items.map(item => item.id).join(',');

    expect(res.status).toBe(200);
    expect(point).toBeTruthy();
    expect(point.id).toEqual(mockDataID);
    expect(point.name).toEqual(mockData.name);
    expect(serializedItems).toEqual(mockData.items);

    done();
  });

  test('it should edit a point', async (done) => {
    const res = await request.put('/points').send({
      ...mockData,
      name: 'Test 2',
      items: [1, 2, 3],
      id: mockDataID
    });

    expect(res.status).toBe(200);

    const res2 = await request.get(`/points/${mockDataID}`);

    const { point, items } = res2.body;
    const serializedItems = items.map(item => item.id).join(',');

    expect(res2.status).toBe(200);
    expect(point).toBeTruthy();
    expect(point.id).toEqual(mockDataID);
    expect(point.name).toEqual('Test 2');
    expect(serializedItems).toEqual('1,2,3');

    done();
  });

  test('it should delete a point', async (done) => {
    const res = await request.delete(`/points/${mockDataID}`);

    expect(res.status).toBe(200);

    done();
  });
});
