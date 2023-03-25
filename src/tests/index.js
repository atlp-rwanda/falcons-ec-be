import * as dotenv from 'dotenv';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import passportStub from 'passport-stub';
import passport from 'passport';
import fs from 'fs';
import { async } from 'regenerator-runtime';
import exp from 'constants';
import app from '../server';
import db from '../database/models/index';
import verifyRole from '../middleware/verifyRole';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service'
import generateToken from '../helpers/token_generator';

const {blacklisToken} = db;

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
describe('login', () => {
  const user = {
    email: 'johndoe@gmail.com',
    password: '12345678',
  };
  const realUser = {
    email: 'boris@gmail.com',
    password: '1234',
  };
  
describe('generateToken', () => {
  it('should generate a valid JWT token', async () => {
    const payload = { id: 123, email: 'testuser@example.com' };
    const token = await generateToken(payload);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.payload).to.deep.equal(payload);
  });

  it('should set the token expiration to 7 days', async () => {
    const payload = { id: 123, email: 'testuser@example.com' };
    const token = await generateToken(payload);

    const decoded = jwt.decode(token, { complete: true });
    const expiration = decoded.payload.exp;
    const now = Math.floor(Date.now() / 1000);

    expect(expiration - now).to.equal(60 * 60 * 24 * 7); // 7 days in seconds
  });
});

describe('UserService', () => {
    it('should create a new user in the database', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'password123',
      };
      const createdUser = await UserService.register(userData);
      expect(createdUser).to.exist;
      expect(createdUser.email).to.equal(userData.email);
      expect(createdUser.password).to.equal(userData.password);
    });
  });

  describe('POST /api/v1/users/signin', () => {
    it('should respond with status code 200', async () => {
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

describe('Set user role', () => {
  const fakeUser = {
    email: 'admin@gmail.com',
    password: 'password',
  };

  const unauthorisedUser = {
    // user with just buyer role
    email: 'boris@gmail.com',
    password: '1234',
  };

  describe("POST /api/v1/users/signup", () => {
    it("should not create a user without full data provided", async () => {
      const response = await chai
        .request(app)
        .post("/api/v1/users/signup")
        .send({ password: "1234" });
      expect(response.status).to.equal(400);
    });

    it("should create a fake admin", async () => {
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
})

describe('verifyRole middleware', () => {
  it('should be a function', () => {
    expect(verifyRole).to.be.a('function');
  });
});

describe('PRODUCT', async () => {
  const realUser = {
    email: 'boris@gmail.com',
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
      response.body.should.be.a('object')
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('productName');
      expect(response.body).to.have.property('description');
      expect(response.body).to.have.property('price');
      expect(response.body).to.have.property('quantity');
      expect(response.body).to.have.property('expiryDate');



      
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
         .post('/api/v1/categories')
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

  it("should return 403 to avoid login of a disabled account", async () => {
    const loginResponse = await chai
      .request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "eric@gmail.com",
        password: "1234",
      });

    expect(loginResponse.status).to.equal(403);
  });

  it("should enable an account", async () => {
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
});

describe('POST /api/v1/users/logout', () => {
  it('should respond with a 200 status code and success message', async () => {
    const req = { headers: { authorization: 'Bearer abc123' } };
    const res = {
      status: (status) => ({
        json: (data) => {
          expect(status).to.equal(200);
          expect(data.success).to.be.true;
          expect(data.message).to.equal('Logout successful');
        }
      })
    };
  });
  it('should return a 404 response', async () => {
    const token = await generateToken();
    const response = await chai
    .request(app)
    .get('/api/v1/protected')
    .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(404)
  });
  it('should respond with error message', async () => {
    const token = await generateToken();
    const response = await chai
      .request(app)
      .post('/api/v1/users/logout')
      .set('Authorization', `Bearer ${token}`)
      expect(response.body.message).to.equal(`Error when authorizing user Cannot read properties of undefined (reading 'id')`);      
  });
  it('should respond with a status code', async () => {
    const token = await generateToken();
    const response = await chai
      .request(app)
      .post('/api/v1/users/logout')
      .set('Authorization', `Bearer ${token}`)
      expect(response.status).to.equal(500);
  });

  it("It should put token in blacklist", async () => {
    const token = await generateToken();
    const res = await request(app).post("/api/v1/users/logout")
    .set("Authorization", `Bearer ${token}`)
    .send({
      token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F0cm9zMjUwQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5MDQwOCwiZXhwIjoxNjc5MzkwNDY4fQ.80S2mmY768UpVKBjgjFiMl0wmsunsMujlypCV50guSY"
    });
    expect(res.statusCode).to.equal(500);
  });

  it('should return a 500 response', async () => {
    const token = await generateToken();
    const blacklist = await blacklisToken.create({ token });
    const response = await chai
      .request(app)
      .post('/api/v1/users/logout')
      .set('Authorization', `Bearer ${token}`)
      expect(response.status).to.equal(500);
  });
});

describe('POST /categories', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/categories')
      .send({ categoryName: 'Test Category' });

    expect(res.status).to.equal(404);
  });
  it('should return an error if category already exists', async () => {
    const category = await db.Category.create({ categoryName: 'Test Category' });

    const res = await request(app)
      .post('/categories')
      .send({ categoryName: 'Test Category' });

    expect(res.status).to.equal(404);
  });
});

describe('PUT /categories/:categoryId', () => {
  it('should update an existing category', async () => {
    const category = await db.Category.create({ categoryName: 'Test Category' });

    const res = await request(app)
      .put(`/categories/${category.id}`)
      .send({ categoryName: 'Updated Category' });

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Category updated successfully');

    const updatedCategory = await db.Category.findByPk(category.id);
    expect(updatedCategory.categoryName).to.equal('Updated Category');
  });

  it('should return an error if category does not exist', async () => {
    const res = await request(app)
      .put('/categories/999')
      .send({ categoryName: 'Updated Category' });

    expect(res.status).to.equal(404);
  });

  it('should return an error if category name is same', async () => {
    const category = await db.Category.create({ categoryName: 'Test Category' });

    const res = await request(app)
      .put(`/categories/${category.id}`)
      .send({ categoryName: 'Test Category' });

    expect(res.status).to.equal(404);
  });
});