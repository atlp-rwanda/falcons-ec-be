/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import * as dotenv from 'dotenv';
import axios from 'axios';
import base64 from 'base-64';

dotenv.config();

export const getToken = async () => {
  try {
    const username = process.env.MOMO_USERNAME;
    const password = process.env.MOMO_API_KEY;
    const credentials = base64.encode(`${username}:${password}`);
    const subscriptionKey = process.env.SUBSCRIPTION_KEY;

    const response = await axios.post(
      `${process.env.MOMO_GET_TOKEN_URL}`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      },
    );

    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};
export const requestToPay = async (req, res, next) => {
  try {
    const url = `${process.env.MOMO_REQUEST_PAYMENT_URL}`;
    const target = `${process.env.TARGET_ENVIRONMENT}`;
    const subscriptionKey = process.env.SUBSCRIPTION_KEY;
    const token = await getToken();

    const headers = {
      'X-Reference-Id': 'f8605b01-204b-4678-9094-41bd95ae6a89',
      'X-Target-Environment': target,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      Authorization: `Bearer ${token}`,
    };

    const body = {
      amount: '10',
      currency: 'EUR',
      externalId: '8e2ef75d-4509-4320-8153-9c53d8355ea1',
      payer: {
        partyIdType: 'MSISDN',
        partyId: req.body.phone,
      },
      payerMessage: 'string',
      payeeNote: 'string',
    };

    res = await axios.post(url, body, { headers });
    const { status } = res;
    req.momoInfo = {
      XReferenceId: headers['X-Reference-Id'],
    };
    next();
  } catch (error) {
    console.error('Error:', error?.message);
  }
};
export const getTransactionStatus = async (req) => {
  const { momoInfo } = req;
  console.log(momoInfo);
  try {
    const url = `${process.env.MOMO_REQUEST_PAYMENT_URL}/${momoInfo.XReferenceId}`;
    const target = process.env.TARGET_ENVIRONMENT;
    const subscriptionKey = process.env.SUBSCRIPTION_KEY;
    const token = await getToken();

    const headers = {
      'X-Target-Environment': target,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });
    const { status } = response.data;
    console.log(status);
    return status;
  } catch (error) {
    console.error('Error:', error?.message);
  }
};
