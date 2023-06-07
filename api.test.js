const request = require('supertest');
const app = require('./index');

describe('API Integration Tests', () => {
  test('GET /transactions', async () => {
    const response = await request(app).get('/transactions');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  // 其他集成测试用例
});
