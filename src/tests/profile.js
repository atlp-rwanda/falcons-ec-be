/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { app } from '../server';

dotenv.config();
// eslint-disable-next-line no-unused-vars
const { expect } = chai;
chai.should();
chai.use(chaiHttp);

const user = { email: 'boris@gmail.com', password: '1234' };
let token = '';

describe('update profile', () => {
  before(async () => {
    await chai.request(app).post('/api/v1/users/signup').send(user);
  });
  describe('login user', () => {
    it('it should login user', async () => {
      const login = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(user);
      token = login.body.token;
    });
  });
  describe('/api/v1/users/profile PATCH', () => {
    it('it should throw an error if the user is not logged in', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/users/profile')
        .send({ firstName: 'Boris' });
      res.should.have.status(401);
      res.body.should.be.a('object');
    });

    it('it should throw an error if no body is provided', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`);
      res.should.have.status(400);
      res.body.should.be.a('object');
    });
    it('it should throw an error if invalid body is provided', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ invalid: 'invalid' });
      res.should.have.status(400);
    });
    it('it should update user profile', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstname: 'Boris' });
      res.should.have.status(200);
      res.body.should.be.a('object');
    });
  });
});
describe('get profile', () => {
  before(async () => {
    await chai.request(app).post('/api/v1/users/signup').send(user);
  });
  describe('login user', () => {
    it('it should login user', async () => {
      const login = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(user);
      token = login.body.token;
    });
  });
  describe('/api/v1/users/profile GET', () => {
    it('it should throw an error if the user is not logged in', async () => {
      const res = await chai.request(app).get('/api/v1/users/profiles');
      res.should.have.status(401);
    });

    it('it should return user profile', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/users/profiles')
        .set('Authorization', `Bearer ${token}`);
      res.should.have.status(200);
    });
  });
});
