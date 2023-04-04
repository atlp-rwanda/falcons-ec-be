/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import sinon from 'sinon';
import db from '../database/models/index';
import markProductExpired from '../events/markProductExpired';
import { app } from '../server';

dotenv.config();
// eslint-disable-next-line no-unused-vars
const { expect } = chai;
chai.should();
chai.use(chaiHttp);

const user = { email: 'eric@gmail.com', password: '1234' };
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
        .send({ firstName: 'Eric' });
      res.should.have.status(500);
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
        .send({ firstname: 'Eric' });
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
  describe('/api/v1/users/profile/single GET', () => {
    it('it should throw an error if the user is not logged in', async () => {
      const res = await chai.request(app).get('/api/v1/users/profile/single');
      res.should.have.status(401);
    });

    it('it should return user profile', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/users/profile/single')
        .set('Authorization', `Bearer ${token}`);
      res.should.have.status(200);
    });
  });
});
describe('markProductExpired', () => {
  const { Product } = db;
  let consoleStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    consoleStub.restore();
  });

  it('should log "No expired products" when there are no expired products', async () => {
    const expiredProducts = [];
    await markProductExpired(expiredProducts);
    expect(consoleStub.calledOnceWithExactly('No expired products')).to.be.true;
  });

  it('should update the status of expired products to "expired"', async function () {
    const testProduct1 = await Product.create({
      productName: 'Test Product',
      description: 'test',
      quantity: 10,
      price: 100,
      expired: false,
      seller_id: '60409d12-ddad-4938-a37a-c17bc33aa4ba',
      expiryDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    });
    const expiredProducts = [testProduct1];
    await markProductExpired(expiredProducts);

    const updatedProduct1 = await Product.findByPk(testProduct1.id);

    assert.isTrue(updatedProduct1.expired);

    await testProduct1.destroy();
  });
});
