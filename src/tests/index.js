/* eslint-disable no-unused-expressions */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
import * as dotenv from 'dotenv';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import passportStub from 'passport-stub';
import passport from 'passport';
import sinon from 'sinon';
import cron from 'node-cron';
import app from '../server';
import db, { sequelize } from '../database/models/index';
import verifyRole from '../middleware/verifyRole';
import { logoutUser } from '../services/authService';
import generateToken from '../helpers/token_generator';
import tokenDecode from '../helpers/token_decode';
import { checkPassword } from '../jobs/checkExpiredPasswords';
import { markPasswordExpired } from '../events/markPasswordExpired';
import { async } from 'regenerator-runtime';

const { blacklisToken } = db;
const { User, Product } = db;
const { Cart } = db;

dotenv.config();

const { expect } = chai;

chai.should();

chai.use(chaiHttp);

let _TOKEN = '';
let token;
const sellerToken = '';
const item = '';
const email = 'gatete@gmail.com';


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
    email: 'umuntu@gmail.com',
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
  let token = '';
  let OTPtoken = '';

  const product = {
    productName: 'test',
    description: 'test',
    price: 100,
    quantity: 10,
    expiryDate: '12/12/30',
    category_id: '0da3d632-a09e-42d5-abda-520aea82ef49',
  };

  const invalidproduct = {
    productName: 'test',
    price: 100,
    quantity: 10,
    expiryDate: '12/12/12',
  };
  const loginResponse = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(realUser);

  OTPtoken = loginResponse.body.OTPtoken;
  const decoded = await tokenDecode(OTPtoken);
  const otpSent = decoded.payload.otpCode;
  const resp = await chai
    .request(app)
    .post(`/api/v1/users/otp/verify/${OTPtoken}`)
    .send({
      otp: otpSent,
    });
  token = resp.body.loginToken;

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

    it('should return 401 if authorization header is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .send(product);
      expect(response.status).to.equal(401);
    });
    it('should return 400 if product name is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'test',
          price: 100,
          quantity: 10,
          expiryDate: '12/12/30',
          category_id: '0da3d632-a09e-42d5-abda-520aea82ef49',
        });
      expect(response.status).to.equal(400);
    });
    it('should return 400 if category_id is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productName: 'test',
          description: 'test',
          price: 100,
          quantity: 10,
          expiryDate: '12/12/30',
        });
      expect(response.status).to.equal(400);
    });
    it('should return 409 if category_id is not a valid UUID', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productName: 'test',
          description: 'test',
          price: 100,
          quantity: 10,
          expiryDate: '12/12/30',
          category_id: 'invalid-uuid',
        });
      expect(response.status).to.equal(409);
    });
    it('should return 400 if price is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productName: 'test',
          description: 'test',
          quantity: 10,
          expiryDate: '12/12/30',
          category_id: '0da3d632-a09e-42d5-abda-520aea82ef49',
        });
      expect(response.status).to.equal(400);
    });
    it('should return 400 if category_id is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productName: 'test',
          description: 'test',
          price: 100,
          quantity: 10,
          expiryDate: '12/12/30',
        });
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
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${_TOKEN}`)
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
    it('should return 400 if validation fails', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidproduct);
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
    });
    it('should return 401 if authorization header is not provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/products')
        .send(product);
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
    });
    it('should return 409 if product already exists', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product);
      expect(response.status).to.equal(409);
    });
    it('should return 400 if product name is not provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'test',
          price: 100,
          quantity: 10,
          expiryDate: '12/12/30',
          category_id: '0da3d632-a09e-42d5-abda-520aea82ef49',
        });
      expect(res.status).to.equal(400);
    });
    it('should return 400 if expiry date is invalid', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productName: 'test',
          description: 'test',
          price: 100,
          quantity: 10,
          expiryDate: 'not a valid date',
          category_id: '0da3d632-a09e-42d5-abda-520aea82ef49',
        });
      expect(response.status).to.equal(400);
    });
  });
  describe('GET /api/v1/products', () => {
    it('should get products', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product);
      response.body.should.be.a('object');
      expect(response.status).to.equal(200);
    });

    it('should return 401 if authorization header is not provided', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products')
        .send(product);
      expect(response.status).to.equal(401);
    });
  });
    describe('GET /api/v1/products/:id', () => {
    it('should get products', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/926ade6c-21f7-4866-ae7f-360d1574839d')
        .set('Authorization', `Bearer ${token}`)
        .send(product);
      response.body.should.be.a('object');
      expect(response.status).to.equal(200);
    });

    it('should return 401 if authorization header is not provided', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/926ade6c-21f7-4866-ae7f-360d1574839d')
        .send(product);
      expect(response.status).to.equal(401);
    });
  });
  describe('PATCH /api/v1/products/:id/availability', () => {
    it('should update the product availability', async () => {
      const response = await chai
        .request(app)
        .patch('/api/v1/products/9974076f-e16a-486f-a923-362ec1747a12/availability')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(400);
    });
    it('should return a 500 error', async () => {
      const response = await chai
        .request(app)
        .patch('/api/v1/products/999999/availability')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('invalid input syntax for type uuid: "999999"');
    });
    it('should return a 400 error', async () => {
      const response = await chai
        .request(app)
        .patch('/api/v1/products/7eb6da79-c94a-4d36-9a05-b9acabb08b3f/availability')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Product not found');
    });
    it('should return an error message', async () => {
      const payload = { email: 'mukakalisajeanne@gmail.com', password: '1234' };
      const userToken = generateToken(payload);
      const response = await chai
        .request(app)
        .patch('/api/v1/products/:id/availability')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: '7eb6da79-c94a-4d36-9a05-b9acabb08b3b' });
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Error when authorizing user jwt malformed');
    });
    it('should return a 500 error', async () => {
      sinon.stub(Product, 'findOne').throws(new Error('Server error'));
      const response = await chai
        .request(app)
        .patch(`/api/v1/products/${product.id}/availability`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Server error');
      Product.findOne.restore();
    });
    it('should update the product availability', async () => {
      const item = await Product.findOne({ where: { productName: 'test' } });
      const res = await request(app)
        .patch(`/api/v1/products/${item.id}/availability`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
    });
  });
  describe('PATCH /api/v1/products/:id', () => {
    it('updates a product and returns the updated data', async () => {
      const updatedProductData = {
        productName: 'Updated Product Name',
        price: 19.99,
        quantity: 5,
        category_id: 2,
      };

      const response = await request(app)
        .patch('/api/v1/products/:id')
        .set('Authorization', 'Bearer valid_token')
        .field('productName', updatedProductData.productName)
        .field('price', updatedProductData.price)
        .field('quantity', updatedProductData.quantity)
        .field('category_id', updatedProductData.category_id);
      expect(response.status).to.equal(500);
    });
    it('should update the product', async () => {
      const payload = { email: 'boris@gmail.com', password: '1234' };
      const userToken = generateToken(payload);
      const res = await chai
        .request(app)
        .patch('/api/v1/products/9974076f-e16a-486f-a923-362ec1747a12')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(500);
    });
    it('Update product - No data provided', async () => {
      const response = await request(app)
        .put('/products/1')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(response.status).to.equal(404);
      expect(response.body.success).to.be.undefined;
    });
    it('should return a 400 error', async () => {
      const response = await chai
        .request(app)
        .patch('/api/v1/products/7eb6da79-c94a-4d36-9a05-b9acabb08b3f')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('No data provided');
    });
    it('should return an error message', async () => {
      const payload = { email: 'eric@gmail.com', password: '1234' };
      const userToken = generateToken(payload);
      const response = await chai
        .request(app)
        .patch('/api/v1/products/:id')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: '7eb6da79-c94a-4d36-9a05-b9acabb08b3b' });
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Error when authorizing user jwt malformed');
    });
    it('it should return 500 if there are no product in store', async () => {
      const newseller = await User.create({
        firstname: 'fstname',
        lastname: 'sdname',
        email: 'example23@gmail.com',
        password: 'testpass2345',
      });
      const newSellerToken = generateToken(newseller);
      const response = await request(app)
        .patch('/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169eb')
        .set('Authorization', `Bearer ${newSellerToken}`);
      expect(response.statusCode).to.equal(500);
    });
    it('it should return 500 if there are no product in seller collection', async () => {
      const newseller = await User.create({
        firstname: 'fstname',
        lastname: 'sdname',
        email: 'example2@gmail.com',
        password: 'testpass2345',
      });
      await newseller.update({ role: 'seller' });
      const newSellerToken = generateToken(newseller);
      const response = await request(app)
        .patch('/api/v1/products/:id')
        .set('Authorization', `Bearer ${newSellerToken}`);
      expect(response.statusCode).to.equal(500);
    });
    it('it should return 500 if the product is not found in seller collection', async () => {
      const newseller = await User.create({
        firstname: 'fstname',
        lastname: 'sdname',
        email: 'example25@gmail.com',
        password: 'testpass2345',
      });
      await newseller.update({ role: 'seller' });
      const newSellerToken = generateToken(newseller);
      const response = await request(app)
        .patch('/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169eb')
        .set('Authorization', `Bearer ${newSellerToken}`);
      expect(response.statusCode).to.equal(500);
    });
    it('should return an error message', async () => {
      const payload = { email: 'mukakalisajeanne@gmail.com', password: '1234' };
      const userToken = generateToken(payload);
      const response = await chai
        .request(app)
        .patch('/api/v1/products/:id')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: '7eb6da79-c94a-4d36-9a05-b9acabb08b3b' });
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Error when authorizing user jwt malformed');
    });
    it('should return a 400 error', async () => {
      sinon.stub(Product, 'findOne').throws(new Error('Server error'));
      const response = await chai
        .request(app)
        .patch('/api/v1/products/3b654f9c-e409-43ea-8062-7fa00f7d6f1a')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(400);
      Product.findOne.restore();
    });
    it('should update the product', async () => {
      const items = await Product.findOne({ where: { id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c', seller_id: '60409d12-ddad-4938-a37a-c17bc33aa4ba' } });
      const res = await request(app)
        .patch(`/api/v1/products/${items.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(400);
    });
    it('should return an error', async () => {
      await Product.findOne({ where: { seller_id: '60409d12-ddad-4938-a37a-c17bc33aa4ba' } });
      const res = await request(app)
        .patch(`/api/v1/products/${item.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(400);
    });
    it('returns an error if the product does not exist', async () => {
      const sampleProduct = {
        productName: 'Sample Product',
        description: 'This is a sample product',
        price: 9.99,
        quantity: 10,
        category_id: 1,
      };
      const response = await request(app)
        .patch('/products/9999')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleProduct);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.be.undefined;
    });
  });
  describe('DELETE /api/v1/products/:id/delete', () => {
    it('should return a 500 error', async () => {
      const response = await chai
        .request(app)
        .delete('/api/v1/products/999999/delete')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('invalid input syntax for type uuid: "999999"');
    });
    it('should return an error', async () => {
      const response = await chai
        .request(app)
        .delete('/api/v1/products/7eb6da79-c94a-4d36-9a05-b9acabb08b3f/delete')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Product not found');
    });
    it('should return an error message', async () => {
      const payload = { email: 'eric@gmail.com', password: '1234' };
      const userToken = generateToken(payload);
      const response = await chai
        .request(app)
        .delete('/api/v1/products/:id/delete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: '7eb6da79-c94a-4d36-9a05-b9acabb08b3b' });
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Error when authorizing user jwt malformed');
    });
    it('should return an error', async () => {
      sinon.stub(Product, 'findOne').throws(new Error('Server error'));
      const response = await chai
        .request(app)
        .delete('/api/v1/products/3b654f9c-e409-43ea-8062-7fa00f7d6f1a/delete')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(500);
      Product.findOne.restore();
    });
    it('should return an error message', async () => {
      const payload = { email: 'mukakalisajeanne@gmail.com', password: '1234' };
      const userToken = generateToken(payload);
      const response = await chai
        .request(app)
        .delete('/api/v1/products/:id/delete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: '7eb6da79-c94a-4d36-9a05-b9acabb08b3b' });
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Error when authorizing user jwt malformed');
    });
    it('should dellete the product', async () => {
      const items = await Product.findOne({ where: { seller_id: '60409d12-ddad-4938-a37a-c17bc33aa4ba' } });
      const res = await request(app)
        .delete(`/api/v1/products/${items.id}/delete`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Unauthorized access');
    });
    it('should return an error status code', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${item.id}`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).to.equal(404);
    });
    it('should delete a product if the user is authorized', async () => {
      const res = await request(app)
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.undefined;
    });
    it('should return an error message if the user is not authorized to delete the product', async () => {
      const user = await User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@example.com',
        password: 'password123',
      });
      const userToken = generateToken(user);

      const res = await request(app)
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(404);
      // Delete the new user
      await User.destroy({ where: { email: 'janedoe@example.com' } });
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
    token = response.body.token;
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
  });
  it('should verify user account when given a valid token', async () => {
    const response = await chai
      .request(app)
      .patch(`/api/v1/users/verify-account/${token}`);
    expect(response.status).to.equal(200);
  });

  it('should not verify user account when given an invalid token', async () => {
    const response = await chai
      .request(app)
      .patch('/api/v1/users/verify-account/invalid-token');
    expect(response.status).to.equal(400);
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
      expect(response.status).to.equal(401);
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
  it('should update the status of expired users to true', async function () {
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
    assert.equal(testUser1.PasswordExpired, true);
    assert.equal(testUser2.PasswordExpired, true);
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
    assert.notEqual(testUser.PasswordExpired, true);
    // Delete the test user from the database
    await testUser.destroy();
  });
});

describe('AddToCart function', async () => {
  // create a seller and a product
  const realUser = {
    email: 'eric@gmail.com',
    password: '1234',
  };
  const buyer = {
    email: 'dean@gmail.com',
    password: '1234',
  };
  const loginResponse = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(realUser);
  token = loginResponse.body.token;
  const res = await chai.request(app).post('/api/v1/users/signin').send(buyer);
  const buyerToken = res.body.token;
  describe('POST /api/v1/cart', () => {
    // test case for adding a product to cart
    it('should add product to cart and return a success message', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c',
          quantity: 1,
        });
      expect(response.status).to.equal(200);
      // assert that the response message is 'Successfully Added to Cart'
      expect(response.body.message).to.equal('Successfully Added to Cart');
    });
        it('should return stock not Available in case there is not enoughs stock', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c',
          quantity: 100,
        });
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Stock is not availabble');
    });
    it('should ask user to login', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 401
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Not logged in');
    });
    it('should return an error in case its not a buyer', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('unauthorised');
    });
  });
  describe('GET /api/v1/cart', () => {
    // test case for adding a product to cart
    it('should get the cart and return a success message', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      expect(response.status).to.equal(200);
    });
    it('should ask user to login', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 401
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Not logged in');
    });
    it('should return an error in case its not a buyer', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 200
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('unauthorised');
    });
  });
  describe('DELETE /api/v1/cart', () => {
    // test case for adding a product to cart
    it('should clear the cart and return an empty cart', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${buyerToken}`);
      expect(response.status).to.equal(200);
    });
    it('should ask user to login', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 401
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Not logged in');
    });
    it('should return an error in case its not a buyer', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 200
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('unauthorised');
    });
  });
  describe('PUT /api/v1/cart', () => {
    // test case for adding a product to cart
    it('should update cart and return a success message', async () => {
      // send a POST request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .put('/api/v1/cart')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c',
          quantity: 1,
        });
      //assert that the response has a status code of 200
      expect(response.status).to.equal(200);
      // assert that the response message is 'Successfully Added to Cart'
    });
    it('should ask user to login', async () => {
      // send a PUT request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .put('/api/v1/cart')
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 401
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Not logged in');
    });
    it('should return an error in case its not a buyer', async () => {
      // send a PUT request to /api/cart with the product ID in the body
      const response = await chai
        .request(app)
        .put('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c' });
      // assert that the response has a status code of 200
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('unauthorised');
    });
  });
});

describe('Order', async () => {
  const buyer = {
    email: 'dean@gmail.com',
    password: '1234',
  };
  const buyerLogin = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(buyer);
  const token = buyerLogin.body.token;

  describe('GET /api/v1/orders/:order_id', () => {
    it('should get the order status ', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/orders/e918e9eb-4c12-417f-8e12-4ec6a0e5ae89')
        .set('Authorization', `Bearer ${token}`)
        

      expect(response.status).to.equal(200);
    });
     it('should not work if user is not logged in ', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/orders/e918e9eb-4c12-417f-8e12-4ec6a0e5ae89')
      expect(response.status).to.equal(401);
    });
     it('should not grant access to a user that is logged in ', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/orders')
      expect(response.status).to.equal(401);
    });
    it('should return an array of orders', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${token}`)
        

      expect(response.status).to.equal(200);
    });

    it('should return  Order not found when user tries to access another users order ', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/orders/0ec3d632-a09e-42e5-abda-520fed82ef57')
        .set('Authorization', `Bearer ${token}`)
        
      expect(response.body.message).to.equal(' Order not found');
    });
  
    
  });
});

