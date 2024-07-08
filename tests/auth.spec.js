const request = require('supertest');
const app = require('../testApp');
const { sequelize, User, Organisation } = require('../models/modelRelationship');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password'
        });
        // console.log("response:", response)
      expect(response.status).toBe(201);
      expect(response.body.data.user).toHaveProperty('userId');
      expect(response.body.data.organisation).toHaveProperty('name', "John's organisation");
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        });
        // console.log('error body:', response.body.errors)
      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual({ field: 'password', message: 'Password is required' });
      expect(response.body.errors).toContainEqual({ field: 'firstName', message: 'First name is required' });
      expect(response.body.errors).toContainEqual({ field: 'lastName', message: 'Last name is required' });
      expect(response.body.errors).toContainEqual({ field: 'email', message: 'Email address is required' });
    });

    it('should fail if there’s duplicate email', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password'
        });

      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual({ field: 'email', message: 'Email address already in use' });
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john2@example.com',
          password: 'password'
        });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john2@example.com',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should fail if credentials are invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john2@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
