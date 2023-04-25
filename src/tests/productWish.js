/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import chaiHttp from 'chai-http';
import chai, { should } from 'chai';
import tokenDecode from '../helpers/token_decode';
import { app } from '../server';

chai.should();
const { expect } = chai;
chai.use(chaiHttp);

let token, OTPtoken;

const buyer = { email: 'dean@gmail.com', password: '1234' };
const seller = { email: 'mukakalisajeanne@gmail.com', password: '1234' };
const sellerUser = { email: 'gatete@gmail.com', password: '1234' };

describe('Product wish list for the buyers', () => {
  it('It should login a user POST', async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/signin')
      .send(buyer);
    token = login.body.token;
  });
  it('it should add product to a wishlist', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/productWish')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: '926ade6c-21f7-4866-ae7f-360d1574839d' });
    expect(response.status).to.equal(201);
    response.body.should.have.property('success');
    response.body.should.have.property('message');
    response.body.should.have.property('productWish');
    expect(response.body.message).to.equal('Product wished sucessfully!');
    response.body.productWish.should.have.property('user_id');
    response.body.productWish.should.have.property('product_id');
  });
  it('it should return 404 error if product not found', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/productWish')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: '926ade6c-21f7-4866-ae7f-360d157483d6' });
    expect(response.status).to.equal(404);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal('Product not found');
  });
  it('it should return 500 error if product not found', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/productWish')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: '926ade6c-21f7-4866-ae7f-360d157483d' });
    expect(response.status).to.equal(500);
    response.body.should.have.property('message');
    expect(response.body.message).to.equal('invalid input syntax for type uuid: "926ade6c-21f7-4866-ae7f-360d157483d"');
  });
  it('It should get a list of product wished for a buyer', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/productWishes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    response.body.should.have.property('success');
    response.body.should.have.property('productWishlist');
    expect(response.body.success).to.be.true;
  });
});

describe('Product wish list for per seller collection', () => {
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
  it('It should get a list of product wished in seller collection', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/productWishes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    response.body.should.have.property('success');
    response.body.should.have.property('productWishlist');
    expect(response.body.success).to.be.true;
  });
});

describe('Wished products per product_id', () => {
  it('should login a seller', async () => {
    const login = await chai.request(app)
      .post('/api/v1/users/signin')
      .send(sellerUser);
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
  it('it should return a number of productWishes per product id', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/products/926ade6c-21f7-4866-ae7f-360d1574839d/productWishes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
  });
  it('it should return 500 error code', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/products/926ade6c-21f7-4866-ae7f-360d157/productWishes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(500);
  });
  it('it should return a number of productWishes per product id', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/products/926ade6c-21f7-4866-ae7f-360d15748346c/productWishes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(500);
  });
});