import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app.js';

describe('Express app', () => {
  it('returns 404 for unknown API routes', async () => {
    const res = await request(app)
      .get('/api/nonexistent');
    expect(res.status)
      .toBe(404);
  });
});
