/**
 * Test Suite for Node.js Express API
 * Tests security, endpoints, and validation
 */

const request = require('supertest');
const app = require('./src/index');

describe('Security Headers', () => {
  test('should include X-Content-Type-Options header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('should include X-Frame-Options header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  test('should include X-XSS-Protection header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-xss-protection']).toBeDefined();
  });
});

describe('Health Check', () => {
  test('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  test('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('healthy');
  });

  test('should include timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('API Endpoints', () => {
  test('GET /api/items should return array', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/items should create item', async () => {
    const newItem = {
      name: 'Test Product',
      description: 'Test description',
      price: 99.99
    };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /api/items/:id should return item', async () => {
    // First create an item
    const newItem = { name: 'Test', price: 10 };
    const createRes = await request(app).post('/api/items').send(newItem);
    const id = createRes.body.id;

    // Then get it
    const res = await request(app).get(`/api/items/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  test('PUT /api/items/:id should update item', async () => {
    const newItem = { name: 'Original', price: 10 };
    const createRes = await request(app).post('/api/items').send(newItem);
    const id = createRes.body.id;

    const res = await request(app)
      .put(`/api/items/${id}`)
      .send({ name: 'Updated', price: 20 });
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  test('DELETE /api/items/:id should delete item', async () => {
    const newItem = { name: 'To Delete', price: 10 };
    const createRes = await request(app).post('/api/items').send(newItem);
    const id = createRes.body.id;

    const res = await request(app).delete(`/api/items/${id}`);
    expect(res.status).toBe(200);

    // Verify deleted
    const getRes = await request(app).get(`/api/items/${id}`);
    expect(getRes.status).toBe(404);
  });
});

describe('Input Validation', () => {
  test('should reject empty name', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: '', price: 10 });
    expect(res.status).toBe(400);
  });

  test('should reject negative price', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Test', price: -10 });
    expect(res.status).toBe(400);
  });

  test('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ description: 'No name' });
    expect(res.status).toBe(400);
  });
});

describe('Error Handling', () => {
  test('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });

  test('should return proper error format', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.body).toHaveProperty('error');
  });
});
