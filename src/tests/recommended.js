/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';

chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe('recommended product to a buyer', () => {
  it('should return recommended product to a buyer', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/product/recommend');
    expect(response.status).to.equal(401);
    response.body.should.have.property('message');
    response.body.should.have.property('success');
    response.body.should.have.property('status');
  });
});
