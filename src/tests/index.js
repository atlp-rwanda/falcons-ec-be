/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
import * as dotenv from 'dotenv';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import passportStub from 'passport-stub';
import passport from 'passport';
import app from '../server';
import db from '../database/models/index';
import { sequelize } from '../database/models/index';
import verifyRole from '../middleware/verifyRole';
import { logoutUser } from '../services/authService';
import generateToken from '../helpers/token_generator';
import sinon from 'sinon';
import cron from 'node-cron';
import { checkPassword } from '../jobs/checkExpiredPasswords';
import { markPasswordExpired } from '../events/markPasswordExpired';

const { blacklisToken } = db;
const { User } = db;

dotenv.config();

const { expect } = chai;

chai.should();

chai.use(chaiHttp);

let _TOKEN = '';

describe('Welcome Controller', () => {
  describe('GET /welcome', () => {
    it('should return a 200 response and a welcome message', async () => {
      const res = await chai.request(app).get('/welcome');
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Test controller OK');
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
  describe('serializeUser', () => {
    it('should serialize user object', (done) => {
      const user = { id: 123, name: 'John Doe' };
      passport.serializeUser((user, done) => {
        done(null, user);
      });
      passport.serializeUser(user, (err, serializedUser) => {
        if (err) return done(err);
        assert.deepEqual(serializedUser, user);
        done();
      });
    });

    it('should return unexpected', (done) => {
      chai
        .request(app)
        .get('/google')
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res).to.have.status(404);
          done();
        });
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

describe('Set user role', () => {
  const fakeUser = {
    email: 'admin@gmail.com',
    password: 'password',
  };

  const unauthorisedUser = {
    // user with just seller role
    email: 'gatete@gmail.com',
    password: '1234',
  };

  describe('POST /api/v1/users/signup', () => {
    it('should not create a user without full data provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({ password: '1234' });
      expect(response.status).to.equal(400);
    });

    it('should create a fake admin', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(fakeUser);
      expect(response.status).to.equal(201);
    });
  });

  describe('PUT /api/v1/users/:id/roles', () => {
    it('should authorise the user without admin role', async () => {
      const loginResponse = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(unauthorisedUser);
      _TOKEN = loginResponse.body.token;
      expect(loginResponse.status).to.equal(200);
    });

    it('should deny the unauthorised user', async () => {
      const response = await chai
        .request(app)
        .put(`/api/v1/users/${fakeUser.email}/roles`)
        .set('Authorization', `Bearer ${_TOKEN}`)
        .send({ role: 'seller' });

      expect(response.status).to.equal(401);
    });

    it('should authorise the fake admin', async () => {
      const loginResponse = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(fakeUser);
      _TOKEN = loginResponse.body.token;
      expect(loginResponse.status).to.equal(200);
    });

    it('should set the role to seller', async () => {
      const response = await chai
        .request(app)
        .put(`/api/v1/users/${fakeUser.email}/roles`)
        .set('Authorization', `Bearer ${_TOKEN}`)
        .send({ role: 'seller' });

      expect(response.status).to.equal(200);
    });
  });
});

describe('login', () => {
  const user = {
    email: 'johndoe@gmail.com',
    password: '12345678',
  };
  const realUser = {
    email: 'boris@gmail.com',
    password: '1234',
  };

  describe('POST /api/v1/users/signin', () => {
    it('should respond login a user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(realUser);
      expect(response.status).to.equal(200);
    });
    it('should throw an error if invalid credentials', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send({ email: 'boris250@gmail.com', password: '123' });
      expect(response.status).to.equal(401);
    });
    it('should throw error if user does not exist ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(user);
      expect(response.status).to.equal(401);
    });
    it('should respond with an array of users', async () => {
      const loginResponse = await chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(realUser);
      const { token } = loginResponse.body;
      const response = await chai
        .request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      expect(response.body).to.be.an('array');
    });
  });
});

describe('verifyRole middleware', () => {
  it('should be a function', () => {
    expect(verifyRole).to.be.a('function');
  });
});

describe('PRODUCT', async () => {
  const realUser = {
    email: 'gatete@gmail.com',
    password: '1234',
  };
  const response = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(realUser);
  const { token } = response.body;
  const product = {
    productName: 'test',
    description: 'test',
    price: 100,
    quantity: 10,
    expiryDate: '12/12/12',
    category_id: '0da3d632-a09e-42d5-abda-520aea82ef49',
  };
  const invalidproduct = {
    productName: 'test',
    price: 100,
    quantity: 10,
    expiryDate: '12/12/12',
  };
  expect(response.status).to.equal(200);
  describe('POST /api/v1/products', () => {
    it('should create a Product', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product);
      response.body.should.be.a('object');
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('productName');
      expect(response.body).to.have.property('description');
      expect(response.body).to.have.property('price');
      expect(response.body).to.have.property('quantity');
      expect(response.body).to.have.property('expiryDate');
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.have.property('updatedAt');
    });
    it('should return 400 incase validation fails', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidproduct);
      expect(response.status).to.equal(400);
    });
    it('should return 400 incase validation fails', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidproduct);
      expect(response.status).to.equal(400);
    });

    it('should return 401 if user is not logged in', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .send(invalidproduct);
      expect(response.status).to.equal(401);
    });
    it('should return 401 if user is not an admin ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${_TOKEN}`)
        .send(invalidproduct);
      expect(response.status).to.equal(401);
    });
  });
});

describe('Disable account', () => {
  it('should disable an account', async () => {
    const response = await chai
      .request(app)
      .patch('/api/v1/users/eric@gmail.com/status')
      .set('Authorization', `Bearer ${_TOKEN}`);
    expect(response.status).to.equal(200);
  });

  it('should return 403 to avoid login of a disabled account', async () => {
    const loginResponse = await chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'eric@gmail.com',
        password: '1234',
      });

    expect(loginResponse.status).to.equal(403);
  });

  it('should return 403 to avoid login of a disabled account', async () => {
    const loginResponse = await chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'eric@gmail.com',
        password: '1234',
      });

    expect(loginResponse.status).to.equal(403);
  });

  it('should enable an account', async () => {
    const response = await chai
      .request(app)
      .patch('/api/v1/users/eric@gmail.com/status')
      .set('Authorization', `Bearer ${_TOKEN}`);
    expect(response.status).to.equal(200);
  });
});
describe('Register User', () => {
  const userRegister = {
    firstname: 'Jackson',
    lastname: 'KANAMUGIRE',
    email: 'jackson@gmail.com',
    password: 'MyPassword2020!',
  };
  it('User should be registered when fields match requirements', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/register')
      .send(userRegister);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('user');
  });
  it('User should not be registered when user email, is invalid ', async () => {
    const userData = {
      firstname: 'Jackson',
      lastname: 'Gakwandi',
      email: 'sbdhfdhf',
      password: '34534',
    };
    const response = await chai
      .request(app)
      .post('/api/v1/users/register')
      .send(userData);
    expect(response.status).to.equal(400);
    expect(response.body).to.be.an('object');
  });
});

describe('POST /api/v1/users/logout', () => {
  it('should respond with a 404 status code', async () => {
    const token = await generateToken();
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status: (status) => ({
        json: (data) => {
          expect(status).to.equal(404);
        },
      }),
    };
  });
  it('should return a 404 response', async () => {
    const token = await generateToken();
    const response = await chai
      .request(app)
      .get('/api/v1/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(404);
  });
  it('should respond with a code', async () => {
    const token = await generateToken();
    const response = await chai
      .request(app)
      .post('/api/v1/users/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(500);
  });
  describe('logoutUser function', () => {
    it('should create a new blacklisted token', async () => {
      const token = await generateToken();
      const data = `Bearer ${token}`;
      let createMethodCalled = false;
      blacklisToken.create = (params) => {
        createMethodCalled = true;
        expect(params).to.deep.equal({ token });
      };
      await logoutUser(data);
      expect(createMethodCalled).to.be.true;
    });
  });
});
describe('CATEGORY', async () => {
  const realUser = {
    email: 'eric@gmail.com',
    password: '1234',
  };
  const response = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(realUser);
  const { token } = response.body;
  const category = {
    categoryName: 'test',
  };
  const invalidcategory = {
    productName: 'test',
    description: 'test',
    price: 100,
    quantity: 10,
  };
  expect(response.status).to.equal(200);
  describe('POST /api/v1/categories', () => {
    it('should create a Category', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(category);
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('categoryName');
      expect(response.body).to.be.an('object');
    });
    it('should return 400 incase validation fails', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidcategory);
      expect(response.status).to.equal(400);
    });
    it('should return 400 incase validation fails', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidcategory);
      expect(response.status).to.equal(400);
    });

    it('should return 401 if user is not logged in', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/categories')
        .send(invalidcategory);
      expect(response.status).to.equal(401);
    });
    it('should return 400 if user is not an admin ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${_TOKEN}`)
        .send(invalidcategory);
      expect(response.status).to.equal(400);
    });
    describe('api/v1/categories/:userId PATCH', () => {
      it('it should update user category', async () => {
        const category = {
          categoryName: 'test 101',
        };
        const res = await chai
          .request(app)
          .patch(`/api/v1/categories/0da3d632-a09e-42d5-abda-520aea82ef49`)
          .set('Authorization', `Bearer ${token}`)
          .send(category);
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect('Content-Type', /json/);
      });
      it('it should not update  categories with the same name', async () => {
        const category = {
          categoryName: 'Category1',
        };
        const res = await chai
          .request(app)
          .patch(`/api/v1/categories/0da3d632-a09e-42d5-abda-520aea82ef49`)
          .set('Authorization', `Bearer ${token}`)
          .send(category);
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(response.body).to.have.property('message');

        expect('Content-Type', /json/);
      });
    });
  });
});

describe('checkPassword', () => {
  let scheduleSpy;

  beforeEach(() => {
    scheduleSpy = sinon.spy(cron, 'schedule');
  });

  afterEach(() => {
    scheduleSpy.restore();
  });

  it('should schedule a cron job correctly', () => {
    checkPassword();

    expect(scheduleSpy.calledOnce).to.be.true;
    expect(scheduleSpy.args[0][0]).to.equal(process.env.CRON_SCHEDULE);
  });
  it('should return an array of expired users', async function () {
    const expiredUsers = await User.findAll({
      where: sequelize.literal(`
    NOW() - "lastPasswordUpdate" > INTERVAL '${process.env.PASSWORD_EXPIRY}'
  `),
    });

    assert.isArray(expiredUsers);
  });
  it('should return an array of expired users', async function () {
    const expiredUsers = await User.findAll({
      where: sequelize.literal(`
    NOW() - "lastPasswordUpdate" < INTERVAL '${process.env.PASSWORD_EXPIRY}'
  `),
    });

    assert.isArray(expiredUsers);
  });
});

describe('markPasswordExpired', () => {
  let consoleStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    consoleStub.restore();
  });
  it('should log "No expired password" when there are no expired users', async () => {
    const expiredUsers = [];
    await markPasswordExpired(expiredUsers);
    expect(consoleStub.calledOnceWithExactly('No expired password')).to.be.true;
  });
  it('should update the status of expired users to NeedsToUpdatePassword', async function () {
    // Create test users with expired passwords
    const testUser1 = await User.create({
      email: 'test1@test.com',
      password: 'password',
      lastPasswordUpdate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    });
    const testUser2 = await User.create({
      email: 'test2@test.com',
      password: 'password',
      lastPasswordUpdate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    });
    const expiredUsers = [testUser1, testUser2];
    await markPasswordExpired(expiredUsers);
    assert.equal(testUser1.status, 'NeedsToUpdatePassword');
    assert.equal(testUser2.status, 'NeedsToUpdatePassword');
    // Delete the test users from the database
    await testUser1.destroy();
    await testUser2.destroy();
  });
  it('should not update the status of users with no last password update date', async function () {
    // Create test user with no last password update date
    const testUser = await User.create({
      email: 'test4@test.com',
      password: 'password',
      lastPasswordUpdate: null,
    });
    const expiredUsers = await User.findAll({
      where: sequelize.literal(`
    NOW() - "lastPasswordUpdate" > INTERVAL '${process.env.PASSWORD_EXPIRY}'
  `),
    });
    const usersWithNoLastPasswordUpdate = [expiredUsers];
    await markPasswordExpired(usersWithNoLastPasswordUpdate);
    assert.notEqual(testUser.status, 'NeedsToUpdatePassword');
    // Delete the test user from the database
    await testUser.destroy();
  });
});
