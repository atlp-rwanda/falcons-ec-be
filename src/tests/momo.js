/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { getToken, getTransactionStatus } from '../controllers/momoPayment';

dotenv.config();

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('Momo payment', () => {
  describe('getToken', () => {
    it('should retrieve a token', async () => {
      const token = await getToken();
      expect(token).to.exist;
    });
  });

  describe('requestToPay', () => {
    it('should send a request to pay and store X-Reference-Id in req.momoInfo', async () => {
      const expectedCartId = uuidv4();
      const expectedTotal = 100;
      const expectedBuyerId = 'bb334579-058c-4784-975f-14f6c8a13fb3';
      const expectedPhone = '0781234567';

      const token = await getToken();
      const expectedToken = token;
      const expectedBody = {
        amount: `${expectedTotal}`,
        currency: 'EUR',
        externalId: `${expectedBuyerId}`,
        payer: {
          partyIdType: 'MSISDN',
          partyId: expectedPhone,
        },
        payerMessage: 'string',
        payeeNote: 'string',
      };

      // Use chai.request to make the request to the API endpoint
      const response = await chai
        .request('https://sandbox.momodeveloper.mtn.com')
        .post('/collection/v1_0/requesttopay')
        .set('Content-Type', 'application/json')
        .set('X-Reference-Id', expectedCartId)
        .set('X-Target-Environment', process.env.TARGET_ENVIRONMENT)
        .set('Ocp-Apim-Subscription-Key', process.env.SUBSCRIPTION_KEY)
        .set('Authorization', `Bearer ${expectedToken}`)
        .send(expectedBody);

      // Make assertions on the response
      expect(response).to.have.status(202);
    });
    it('should fail when id do not change', async () => {
      const expectedCartId = 'bb334579-058c-4784-975f-14f6c8a13fb3';
      const expectedTotal = 100;
      const expectedBuyerId = 'bb334579-058c-4784-975f-14f6c8a13fb3';
      const expectedPhone = '0781234567';

      const token = await getToken();
      const expectedToken = token;
      const expectedBody = {
        amount: `${expectedTotal}`,
        currency: 'EUR',
        externalId: `${expectedBuyerId}`,
        payer: {
          partyIdType: 'MSISDN',
          partyId: expectedPhone,
        },
        payerMessage: 'string',
        payeeNote: 'string',
      };

      // Use chai.request to make the request to the API endpoint
      const response = await chai
        .request('https://sandbox.momodeveloper.mtn.com')
        .post('/collection/v1_0/requesttopay')
        .set('Content-Type', 'application/json')
        .set('X-Reference-Id', expectedCartId)
        .set('X-Target-Environment', process.env.TARGET_ENVIRONMENT)
        .set('Ocp-Apim-Subscription-Key', process.env.SUBSCRIPTION_KEY)
        .set('Authorization', `Bearer ${expectedToken}`)
        .send(expectedBody);

      // Make assertions on the response
      expect(response).to.have.status(409);
    });
  });
  chai.use(chaiHttp);

  describe('getTransactionStatus', () => {
    it('should handle errors and return 500 status with error message', async () => {
      const req = {
        user: { id: 'bb334579-058c-4784-975f-14f6c8a13fb3' },
        momoInfo: { XReferenceId: 'c7d65c67-aeb0-4d30-8964-24d23f6624e1' },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      process.env.MOMO_REQUEST_PAYMENT_URL = 'mock-request-payment-url';
      process.env.TARGET_ENVIRONMENT = 'mock-target-environment';
      process.env.SUBSCRIPTION_KEY = 'mock-subscription-key';

      // Call the function
      await getTransactionStatus(req, res);

      // Assert the response
      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});
