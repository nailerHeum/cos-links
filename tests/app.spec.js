const should = require('chai').should();
const config = require('config');
const request = require('supertest');
const server = require('../app');
console.log(server.port)

describe('Server', ()=>{
    it('서버가 해당 포트에서 동작하는지 테스트', ()=>{
        server.port.should.equal(config.get('port'));
    });
    it('/ 에서 정상적으로 response를 주는가', (done) => {
      request(server).get('/')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          res.text.should.equal('hello world!');
          done();
          return;
        });
    });
});