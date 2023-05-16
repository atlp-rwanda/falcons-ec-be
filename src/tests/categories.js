import * as dotenv from "dotenv";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../server";
dotenv.config();
const { expect } = chai;
chai.should();
chai.use(chaiHttp);

let token = "";
const buyer = { email: "dean@gmail.com", password: "1234" };
const categoryId = "0da3d632-a09e-42d5-abda-520aea82ef49";

describe("Categories listing", () => {
  it("It should login a user POST", async () => {
    const login = await chai
      .request(app)
      .post("/api/v1/users/signin")
      .send(buyer);
    token = login.body.token;
  });

  it("It should get a list of categories", async () => {
    const response = await chai
      .request(app)
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    response.body.should.have.property("categories");
  });

  it("It should get a single category", async () => {
    const response = await chai
      .request(app)
      .get(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(200);
    response.body.should.have.property("category");
  });
});
