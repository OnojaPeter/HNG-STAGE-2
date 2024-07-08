const request = require('supertest');
const app = require('../testApp'); // test express app
const {  sequelize, User, Organisation, UserOrganisation } = require('../models/modelRelationship');

describe('Organisation Access', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const user1 = await User.create({ firstName: 'User1', lastName: 'Test', email: 'user1@example.com', password: 'password' });
    const user2 = await User.create({ firstName: 'User2', lastName: 'Test', email: 'user2@example.com', password: 'password' });
    const org = await Organisation.create({ name: "User1's Organization", description: 'Test Org' });

    await UserOrganisation.create({ userId: user1.userId, orgId: org.orgId });
  } );
  afterAll(async () => {
    await sequelize.close();
  });
  

  it('should prevent users from accessing organizations they do not belong to', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'user2@example.com', password: 'password' });

    const token = loginResponse.body.data.accessToken;

    const response = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.organisations).toHaveLength(0);
  });
  
});
