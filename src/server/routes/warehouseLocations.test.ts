import request from 'supertest';
import { app } from '../app.js';

describe('GET /api/warehouse-locations', () => {
  it('returns 200 with JSON content-type', async () => {
    const res = await request(app)
      .get('/api/warehouse-locations');

    expect(res.status)
      .toBe(200);
    expect(res.headers['content-type'])
      .toMatch(/application\/json/);
  });

  it('returns response with data array', async () => {
    const res = await request(app)
      .get('/api/warehouse-locations');

    expect(res.body)
      .toHaveProperty('data');
    expect(Array.isArray(res.body.data))
      .toBe(true);
  });

  it('returns all warehouse locations from the database', async () => {
    const res = await request(app)
      .get('/api/warehouse-locations');

    expect(res.body.data)
      .toHaveLength(20);
  });

  it('returns locations with id, name, zone, and capacity fields', async () => {
    const res = await request(app)
      .get('/api/warehouse-locations');

    for (const location of res.body.data) {
      expect(location)
        .toEqual(expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          zone: expect.any(String),
          capacity: expect.any(Number),
        }));
    }
  });

  it('includes known seed locations', async () => {
    const res = await request(app)
      .get('/api/warehouse-locations');

    const names = res.body.data.map((loc: { name: string }) => loc.name);
    expect(names)
      .toContain('Kakariko Village');
    expect(names)
      .toContain('Hyrule Castle');
    expect(names)
      .toContain('Riverside Stable');
  });
});
