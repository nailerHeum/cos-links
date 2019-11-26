const should = require("chai").should();
const fs = require("fs");
const path = require("path");
const config = require("config");
const request = require("supertest");
const server = require("../app");

describe("Server", () => {
  it("서버가 해당 포트에서 동작하는지 테스트", () => {
    server.port.should.equal(parseInt(process.env.port, 10));
  });
  it("/ 에서 정상적으로 response를 주는가", done => {
    const resFile = path.resolve(__dirname, "../public/index.html");
    const resText = fs.readFileSync(resFile).toString();
    request(server)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }
        res.text.should.equal(resText);
        done();
        return;
      });
  });
  it("get /v1 request", done => {
    request(server)
      .get("/v1")
      .set("x-access-token", process.env.accesskey)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }
        res.body.should.have.property("links");
        res.body.should.have.property("categories");
        done();
        return;
      });
  });
  it("post /v1/link request", done => {
    request(server)
      .post("/v1/link")
      .set("x-access-token", process.env.accesskey)
      .send({
        author: "Corn",
        title: "스토리보드",
        description: "아오에스분들 보세여",
        category: "iOS",
        url: "https://baked-corn.tistory.com/54"
      })
      .set("Accept", "application/json")
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }
        res.body.message.should.be.equal("Link Created!");
        done();
        return;
      });
  });
});
