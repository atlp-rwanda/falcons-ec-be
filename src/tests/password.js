import chai from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { app } from '../server';

dotenv.config();
const { expect } = chai;
chai.should();
chai.use(chaiHttp);

const invalidPassword = { oldPassword: '654321', newPassword: '1234567', confirmPassword: '1234567' };
const user = { email: 'jet@gmail.com', password: '123456' };
let token = '';

describe('create user', () => {
  before(async () => {
    const s = await chai.request(app)
      .post('/api/v1/users/signup')
      .send(user);
  });
  describe('login user', () => {
    it('it should login user', async () => {
      const login = await chai.request(app)
        .post('/api/v1/users/signin')
        .send(user);
      token = login.body.token;
    });
  });
  describe('/api/v1/users/:userId/password PATCH', () => {
    it('it should return error and status 403', async () => {
      const response = await chai.request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      const res = await chai.request(app)
        .patch(`/api/v1/users/${response.body[3].id}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidPassword);
      res.should.have.status(403);
      res.body.should.be.a('object');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid password');
    });
  });
  describe('api/v1/users/:userId/password PATCH', () => {
    it('it should update user password', async () => {
      const Password = {
        oldPassword: '123456',
        newPassword: '123456',
        confirmPassword: '123456'
      };
      const response = await chai.request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      const res = await chai.request(app)
        .patch(`/api/v1/users/${response.body[3].id}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send(Password);
      res.should.have.status(200);
      res.body.should.be.a('object');
      expect('Content-Type', /json/);
      expect(res.body).to.have.property('message');
      res.body.message.should.equal('password updated successfully');
    });
    it('it should return error', async () => {
      const passWord = {
        oldPassword: '123456',
        confirmPassword: '123456'
      };
      const error = await chai.request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      const res = await chai.request(app)
        .patch(`/api/v1/users/${error.body[3].id}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send(passWord);
      res.should.have.status(400);
    });
  });
});
