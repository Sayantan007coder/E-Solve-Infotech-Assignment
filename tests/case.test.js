import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import Case from '../src/models/caseModel.js';

beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dcoe_test';
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /cases/upload', () => {
  it('should upload cases and return 201', async () => {
    const cases = [
      {
        case_id: 'case1',
        bank_code: 'bank1',
        borrower_name: 'John Doe',
        loan_amount: 1000,
        due_amount: 500,
        days_past_due: 20,
        priority: 'High',
        region: 'North',
      },
    ];

    const res = await request(app)
      .post('/cases/upload')
      .send(cases)
      .set('Authorization', `Bearer ${process.env.JWT_TEST_TOKEN}`)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('cases');
  });
});

describe('GET /analytics/summary', () => {
  it('should return analytics summary', async () => {
    const res = await request(app)
      .get('/analytics/summary')
      .set('Authorization', `Bearer ${process.env.JWT_TEST_TOKEN}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalCasesByStatus');
    expect(res.body).toHaveProperty('avgResolutionTime');
    expect(res.body).toHaveProperty('caseCountPerTeam');
    expect(res.body).toHaveProperty('totalDueRecovered');
  });
});