import app from '@src/app';
import supertest from 'supertest';

const request = supertest(app);

const mockData = {
  image: 'test.svg',
  title: 'Test'
};

var mockDataID = 0;

describe('ItemsController', () => {
  test('it should create a new item', async (done) => {
    const res = await request.post('/items').send(mockData);

    mockDataID = res.body;

    expect(res.status).toBe(200);
    expect(mockDataID > 0).toBeTruthy();

    done();
  });

  test('it should list items', async (done) => {
    const res = await request.get('/items');

    expect(res.status).toBe(200);
    expect(res.body.length > 0).toBeTruthy();
    expect(res.body[res.body.length - 1].id).toEqual(mockDataID);

    done();
  });

  test('it should get item by id', async (done) => {
    const res = await request.get(`/items/${mockDataID}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.id).toEqual(mockDataID);
    expect(res.body.title).toEqual(mockData.title);
    expect(res.body.image).toEqual(mockData.image);

    done();
  });

  test('it should edit an item', async (done) => {
    const res = await request.put('/items').send({
      ...mockData,
      id: mockDataID
    });

    expect(res.status).toBe(200);

    done();
  });

  test('it should delete an item', async (done) => {
    const res = await request.delete(`/items/${mockDataID}`);

    expect(res.status).toBe(200);

    done();
  });
});
