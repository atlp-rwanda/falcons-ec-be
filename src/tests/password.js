/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { app } from '../server';

dotenv.config();
const { expect } = chai;
chai.should();
chai.use(chaiHttp);

const invalidPassword = {
  oldPassword: 'Japhet12345678',
  newPassword: 'Japhet12345678',
  confirmPassword: 'Japhet12345678',
};
const user = { email: 'boris@gmail.com', password: '1234' };
const kyles = { email: 'kylesjet1@gmail.com' };
let token = '';
let tokenSecret = '';
describe('create user', () => {
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
  describe('/api/v1/users/password PATCH', () => {
    it('it should return error and status 403', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidPassword);
      res.should.have.status(403);
      res.body.should.be.a('object');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Incorrect password');
    });
  });
  describe('api/v1/users/password PATCH', () => {
    it('it should update user password', async () => {
      const Password = {
        oldPassword: '1234',
        newPassword: 'Japhet12345678',
        confirmPassword: 'Japhet12345678',
      };
      const res = await chai
        .request(app)
        .patch('/api/v1/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send(Password);
      res.should.have.status(200);
      res.body.should.be.a('object');
      expect('Content-Type', /json/);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('password updated successfully');
    });
    it('it should return error', async () => {
      const passWord = {
        oldPassword: '123456',
        confirmPassword: '123456',
      };
      const res = await chai
        .request(app)
        .patch('/api/v1/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send(passWord);
      res.should.have.status(400);
    });
  });
  describe('Password reset', () => {
    describe('/api/v1/users/password-reset-request POST', () => {
      it('it should send a request to reset the password', async () => {
        const response = await chai
          .request(app)
          .post('/api/v1/users/password-reset-request')
          .send(kyles);
        response.should.have.status(200);
        expect('Content-Type', /json/);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.deep.equal('email sent to the user');
        tokenSecret = response.body.token;
      });

      it('It should not send an email', async () => {
        const response = await chai
          .request(app)
          .post('/api/v1/users/password-reset-request')
          .send({ email: 'password reset' });
        response.should.have.status(400);
        expect('Content-Type', /json/);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.deep.equal('User not found');
      });

      it('it should reset user password', async () => {
        const p = {
          password: 'Japhet12345678',
          confirmPassword: 'Japhet12345678',
        };

        const reset = await chai
          .request(app)
          .patch(`/api/v1/users/${tokenSecret}/password-reset`)
          .send(p);
        expect('Content-Type', 'application/json');
        reset.should.have.status(200);
        reset.body.should.have.property('message');
        reset.body.message.should.equal('Password reset successfully');
      });
      it('should return error', async () => {
        const errorToken = 'password';
        const pwd = {
          password: 'Japhet12345678',
          confirmPassword: 'Japhet12345678',
        };
        const err = await chai
          .request(app)
          .patch(`/api/v1/users/${errorToken}/password-reset`)
          .send(pwd);
        expect(err.text).to.equal('Bad Request');
        expect(err.status).to.equal(400);
      });
    });
  });
});
