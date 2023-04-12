import * as dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Stripe from 'stripe';

import app from '../server';

const stripe = new Stripe(process.env.STRIPE_API_KEY);

dotenv.config();
const { expect } = chai;
chai.should();
chai.use(chaiHttp);
const user = {
  email: 'umuntu@gmail.com',
  password: '1234',
};
let token = '';
let session_id = '';
describe('Checkout', () => {
  it('should login the user', async () => {
    const login = await chai
      .request(app)
      .post('/api/v1/users/signin')
      .send(user);
    token = login.body.token;
  });

  it('should add item to cart', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c',
        quantity: 1,
      });
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Successfully Added to Cart');
  });

  it('should perform checkout', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/orders/checkout')
      .set('Authorization', `Bearer ${token}`);
    session_id = response.body.session_id;

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(
      'Order created, use the url to complete payment',
    );
  });

  it('should update the order status', async () => {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // a fake event object
    const event = {
      id: 'evt_1JhoY5K5z1lQdKNCJzF6aHd8',
      object: 'event',
      api_version: '2021-09-08',
      created: 1661328504,
      data: {
        object: {
          id: 'cs_test_xxxxxxxxxxxxx',
          object: 'checkout.session',
          billing_address_collection: null,
          cancel_url: 'https://example.com/cancel',
          client_reference_id: null,
          customer: session.customer,
          customer_email: null,
          livemode: false,
          locale: null,
          metadata: {},
          mode: 'payment',
          payment_intent: {
            id: 'pi_test_xxxxxxxxxxxxx',
            object: 'payment_intent',
            amount: 1000,
            amount_capturable: 0,
            amount_received: 0,
            application: null,
            application_fee_amount: null,
            canceled_at: null,
            cancellation_reason: null,
            capture_method: 'automatic',
            charges: {
              object: 'list',
              data: [],
              has_more: false,
              total_count: 0,
              url: '/v1/charges?payment_intent=pi_test_xxxxxxxxxxxxx',
            },
            client_secret: 'pi_test_xxxxxxxxxxxxx_secret_xxxxxxxxxxxxx',
            confirmation_method: 'automatic',
            created: 1661328498,
            currency: 'usd',
            customer: null,
            description: null,
            invoice: null,
            last_payment_error: null,
            livemode: false,
            metadata: {},
            next_action: null,
            on_behalf_of: null,
            payment_method: null,
            payment_method_options: {
              card: {
                installments: null,
                network: null,
                request_three_d_secure: 'automatic',
              },
            },
            payment_method_types: ['card'],
            receipt_email: null,
            review: null,
            setup_future_usage: null,
            shipping: null,
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: 'succeeded',
            transfer_data: null,
            transfer_group: null,
          },
          payment_method_types: ['card'],
          status: 'completed',
          success_url: 'https://example.com/success',
        },
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null,
      },
      type: 'checkout.session.completed',
    };

    const response = await chai.request(app).post('/webhook').send(event);

    expect(response.status).to.equal(200);
  });

  it('should return 400 after the payment fails', async () => {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // a fake event object
    const event = {
      id: 'evt_1JhoY5K5z1lQdKNCJzF6aHd8',
      object: 'event',
      api_version: '2021-09-08',
      created: 1661328504,
      data: {
        object: {
          id: 'cs_test_xxxxxxxxxxxxx',
          object: 'checkout.session',
          billing_address_collection: null,
          cancel_url: 'https://example.com/cancel',
          client_reference_id: null,
          customer: session.customer,
          customer_email: null,
          livemode: false,
          locale: null,
          metadata: {},
          mode: 'payment',
          payment_intent: {
            id: 'pi_test_xxxxxxxxxxxxx',
            object: 'payment_intent',
            amount: 1000,
            amount_capturable: 0,
            amount_received: 0,
            application: null,
            application_fee_amount: null,
            canceled_at: null,
            cancellation_reason: null,
            capture_method: 'automatic',
            charges: {
              object: 'list',
              data: [],
              has_more: false,
              total_count: 0,
              url: '/v1/charges?payment_intent=pi_test_xxxxxxxxxxxxx',
            },
            client_secret: 'pi_test_xxxxxxxxxxxxx_secret_xxxxxxxxxxxxx',
            confirmation_method: 'automatic',
            created: 1661328498,
            currency: 'usd',
            customer: null,
            description: null,
            invoice: null,
            last_payment_error: null,
            livemode: false,
            metadata: {},
            next_action: null,
            on_behalf_of: null,
            payment_method: null,
            payment_method_options: {
              card: {
                installments: null,
                network: null,
                request_three_d_secure: 'automatic',
              },
            },
            payment_method_types: ['card'],
            receipt_email: null,
            review: null,
            setup_future_usage: null,
            shipping: null,
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: 'succeeded',
            transfer_data: null,
            transfer_group: null,
          },
          payment_method_types: ['card'],
          status: 'completed',
          success_url: 'https://example.com/success',
        },
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null,
      },
      type: 'checkout.session.failed',
    };

    const response = await chai.request(app).post('/webhook').send(event);

    expect(response.status).to.equal(400);
  });
});
