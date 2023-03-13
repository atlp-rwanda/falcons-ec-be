import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import db from "../database/models/index";
import bcrypt from "bcrypt";
import request from 'supertest';

const expect = chai.expect;
chai.should();

chai.use(chaiHttp);

describe("Welcome Controller", () => {
  before(async () => {
    // run migrations and seeders to prepare the database
    await db.sequelize.sync({ force: true });
  });

  describe("GET /welcome", () => {
    it("should return a 200 response and a welcome message", async () => {
      const res = await chai.request(app).get("/welcome");
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal("Test controller OK");
    });
  });
});

  describe('Routes', () => {
    describe('GET /users', () => {
      it('should respond with status code 200', async () => {
        const response = await request(app).get('/users');
        expect(response.status).to.equal(200);
      });
  
      it('should respond with an array of users', async () => {
        const response = await request(app).get('/users');
        expect(response.body).to.be.an('array');
      });
    });
  });