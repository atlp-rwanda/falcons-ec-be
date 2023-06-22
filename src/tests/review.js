/* eslint-disable import/no-extraneous-dependencies */
import chaiHttp from 'chai-http';
import chai from 'chai';
import { app } from '../server';
import tokenDecode from '../helpers/token_decode';

chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe('Review', async () => {
  const buyer = {
    email: 'dean@gmail.com',
    password: '1234',
  };
  const seller = {
    email: 'boris@gmail.com',
    password: '1234',
  };
  const review = {
    ratings: 5,
    feedback: 'Test feedback',
  };
  const incomplete_review = {
    feedback: 'Test feedback',
  };
  const buyerLogin = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(buyer);
  const { token } = buyerLogin.body;
  const sellerLogin = await chai
    .request(app)
    .post('/api/v1/users/signin')
    .send(seller);
  const seller_token = sellerLogin.body.token;
  let review_added = '';

  describe('GET /api/v1/products/:id/reviews', () => {
    it('should get the review ', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
    });
    
    
  });
  describe('POST /api/v1/products/:id/reviews', () => {
    it('should not  Add the review on a product due to failure of validation ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send(incomplete_review);
      expect(response.status).to.equal(400);
      expect(response.text).to.equal('"ratings" is required');
    });
    it('should Add the review on a product  ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send(review);
      review_added = response.body.review;

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Successfully Added Review');
    });
    it('should not work if user is not logged in ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews');
      expect(response.status).to.equal(401);
    });
    it('should not work if user is not a buyer ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews')
        .set('Authorization', `Bearer ${seller_token}`);

      expect(response.status).to.equal(401);
    });
  });
  describe('PUT /api/v1/products/:id/reviews', () => {
    it('should not  Add the review on a product due to failure of validation ', async () => {
      const response = await chai
        .request(app)
        .put(`/api/v1/products/${review_added.id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send(incomplete_review);
      expect(response.status).to.equal(400);
      expect(response.text).to.equal('"ratings" is required');
    });

    it('should not work if user is not logged in ', async () => {
      const response = await chai
        .request(app)
        .put(`/api/v1/products/${review_added.id}/reviews`);
      expect(response.status).to.equal(401);
    });
    it('should not work if user is not a buyer ', async () => {
      const response = await chai
        .request(app)
        .put(`/api/v1/products/${review_added.id}/reviews`)
        .set('Authorization', `Bearer ${seller_token}`);
      expect(response.status).to.equal(401);
    });
  });
  describe('DELETE /api/v1/products/:id/reviews', () => {
    it('should not work if user is not logged in ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews');
      expect(response.status).to.equal(401);
    });
    it('should not work if user is not a buyer ', async () => {
      const response = await chai
        .request(app)
        .delete('/api/v1/products/4b35a4b0-53e8-48a4-97b0-9d3685d3197c/reviews')
        .set('Authorization', `Bearer ${seller_token}`);
      expect(response.status).to.equal(401);
    });
  });
});
