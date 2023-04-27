/* eslint-disable import/no-extraneous-dependencies */
import chaiHttp from 'chai-http';
import chai from 'chai';
import { app } from '../server';
import tokenDecode from '../helpers/token_decode';

chai.should();
const { expect } = chai;
chai.use(chaiHttp);

let token, OTPtoken;
const buyer = { email: 'dean@gmail.com', password: '1234' };
const seller = { email: 'kylesjet1@gmail.com', password: 'Japhet12345678' };
describe('Product search by a buyer', () => {
  it('should login a buyer', async () => {
    const login = await chai.request(app)
      .post('/api/v1/users/signin')
      .send(buyer);
    token = login.body.token;
  });
  describe('GET /api/v1/product/search/?name', () => {
    it('it should search product by name ', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?name=product 1')
        .set('Authorization', `Bearer ${token}`);
      expect('Content-type', /json/);
      expect(res.status).to.equal(200);
    });
  });
  describe('GET /api/v1/product/search/?minPrice&macPrice', () => {
    it('it should search product by price range ', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?minPrice=1&maxPrice=1000')
        .set('Authorization', `Bearer ${token}`);
      expect('Content-type', /json/);
      expect(res.status).to.equal(200);
    });
  });
  describe('GET /api/v1/product/search/?category', () => {
    it('it should search product by category ', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?category=category1')
        .set('Authorization', `Bearer ${token}`);
      expect('Content-type', /json/);
      expect(res.status).to.equal(200);
    });
  });
  describe('GET /api/v1/product/search/?description', () => {
    it('it should search product by description ', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?description=description 1')
        .set('Authorization', `Bearer ${token}`);
      expect('Content-type', /json/);
      expect(res.status).to.equal(200);
    });
  });
  describe('GET /api/v1/product/search/?name&description', () => {
    it('it should search product by name and description ', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?name=product&description=description 1')
        .set('Authorization', `Bearer ${token}`);
      expect('Content-type', /json/);
      expect(res.status).to.equal(200);
    });
  });
});
describe('Product search by a seller', () => {
  it('should login a seller', async () => {
    const login = await chai.request(app)
      .post('/api/v1/users/signin')
      .send(seller);
    OTPtoken = login.body.OTPtoken;
    const decoded = await tokenDecode(OTPtoken);
    const otpSent = decoded.payload.otpCode;
    const resp = await chai
      .request(app)
      .post(`/api/v1/users/otp/verify/${OTPtoken}`)
      .send({
        otp: otpSent,
      });
    token = resp.body.loginToken;
  });
  it('It should search a product by name', async () => {
    const response = await chai.request(app)
      .get('/api/v1/products/search?name=product 1')
      .set('Authorization', `Bearer ${token}`);
    expect('Content-Type', /json/);
    response.body.should.have.property('message');
    response.body.message.should.equal('No product found');
  });
  it('It should search a product by price range', async () => {
    const response = await chai.request(app)
      .get('/api/v1/products/search?minPrice=1&maxPrice=1000')
      .set('Authorization', `Bearer ${token}`);
    expect('Content-Type', /json/);
    response.body.should.have.property('message');
    response.body.message.should.equal('No product found');
  });
  it('It should search a product by name and description', async () => {
    const response = await chai.request(app)
      .get('/api/v1/products/search?name=product 1&description=description 1')
      .set('Authorization', `Bearer ${token}`);
    expect('Content-Type', /json/);
    response.body.should.have.property('message');
    response.body.message.should.equal('No product found');
  });
  it('It should search a product by description', async () => {
    const response = await chai.request(app)
      .get('/api/v1/products/search?description=description 1')
      .set('Authorization', `Bearer ${token}`);
    expect('Content-Type', /json/);
    response.body.should.have.property('message');
    response.body.message.should.equal('No product found');
  });
  it('It should search a product by description', async () => {
    const response = await chai.request(app)
      .get('/api/v1/products/search?name=product 1&description=description 1&minPrice=1&maxPrice=900')
      .set('Authorization', `Bearer ${token}`);
    expect('Content-Type', /json/);
    response.body.should.have.property('message');
    response.body.message.should.equal('No product found');
  });
  it('It should search a product by description', async () => {
    const invalidToken = 'eyttggddgjkfjkdsgnjkbjlgiabngjkan.gkjhag';
    const response = await chai.request(app)
      .get('/api/v1/products/search?description=description 1')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect('Content-Type', /json/);
    expect(response.status).to.be.equal(500);
    response.body.should.have.property('message');
    response.body.should.have.property('success');
    response.body.should.have.property('status');
  });
  it('It should update product availability', async () => {
    const id = '926ade6c-21f7-4866-ae7f-360d1574839e';
    const product = await chai.request(app)
      .patch(`/api/v1/products/${id}/availability`)
      .set('Authorization', `Bearer ${token}`);
    expect(product.status).to.equal(401);
    product.body.should.have.property('message');
    product.body.message.should.equal('Unauthorized access!');
  });
});
describe('update product availability', () => {
  it('should login a seller', async () => {
    const login = await chai.request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'kirengaboris5@gmail.com', password: '1234' });
    OTPtoken = login.body.OTPtoken;
    const decoded = await tokenDecode(OTPtoken);
    const otpSent = decoded.payload.otpCode;
    const resp = await chai
      .request(app)
      .post(`/api/v1/users/otp/verify/${OTPtoken}`)
      .send({
        otp: otpSent,
      });
    token = resp.body.loginToken;
  });
  it('should update product', async () => {
    const id = '926ade6c-21f7-4866-ae7f-360d1574839e';
    const product = await chai.request(app)
      .patch(`/api/v1/products/${id}/availability`)
      .set('Authorization', `Bearer ${token}`);
    expect(product.status).to.equal(200);
    product.body.should.have.property('message');
    product.body.message.should.equal('Product availability updated');
  });
});
