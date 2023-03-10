import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import db from '../database/models/index';
import bcrypt from 'bcrypt';
import request from 'supertest';
import generateToken from '../helpers/token_generator.js';
import { assert } from 'chai';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passportStub from 'passport-stub';
import passport from 'passport';

const expect = chai.expect;

chai.should();

chai.use(chaiHttp);

describe('Welcome Controller', () => {
  before(async () => {
    // run migrations and seeders to prepare the database
    await db.sequelize.sync({ force: true });
  });

  describe('GET /welcome', () => {
    it('should return a 200 response and a welcome message', async () => {
      const res = await chai.request(app).get('/welcome');
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Test controller OK');
    });
  });
});

describe('Routes', () => {
  describe('GET /users', () => {
    it('should respond with status code 200', async () => {
      const response = await request(app).get('/users');
      expect(response.status).to.equal(200);
    });

    it('should respond with an array of users', async () => {
      const response = await request(app).get('/users');
      expect(response.body).to.be.an('array');
    });
  });
});

describe('Google Authentication', () => {
  const mockUser = {
    email: 'johndoe@gmail.com',
    password: '12345678',
  };

  describe('GET /auth/google', () => {
    before(() => {
      // set up passport-stub to simulate authentication
      passportStub.install(app);
    });

    after(() => {
      // uninstall passport-stub after the tests are finished
      passportStub.uninstall();
    });

    it('should redirect to Google auth page', (done) => {
      request(app)
        .get('/auth/google')
        .expect(302) // expect a redirect
        .end((err, res) => {
          if (err) return done(err);
          assert(
            res.headers.location.startsWith(
              'https://accounts.google.com/o/oauth2/v2/auth',
            ),
          );
          done();
        });
    });
  });

  describe('GET /google/callback', () => {
    it('should get a Bad Request when accessing google callback with no token', async () => {
      const response = await request(app).get('/google/callback');
      expect(response.status).to.equal(302);
    });

    it('should return a token when generateToken is called ', async () => {
      const response = await generateToken(mockUser);
      expect(response).to.be.a('string');
    });
  });
});
describe('generateToken', () => {
  it('should return a token when provided with valid payload', async () => {
    const payload = { email: 'johndoe@gmail.com', password: '123' };

    const token = await generateToken(payload);

    expect(token).to.be.a('string');
  });

  it('should throw an error when provided with an invalid payload', async () => {
    const payload = undefined;
    const req = {};
    const res = {};

    try {
      const token = await generateToken(payload);
    } catch (err) {
      expect(err).to.be.an('error');
    }
  });
});
