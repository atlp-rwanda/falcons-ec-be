import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let token;
const user = { email: 'umuntu@gmail.com', password: '1234' };

describe('recommended product to a buyer', () => {
  it('should login a buyer', async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/signin')
      .send(user);
    console.log(login.body);
    token = login.body.token;
  });
  it('should return recommended product to a buyer', async () => {
    const response = await chai.request(app)
      .get('/api/v1/product/recommend')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
  });
});
