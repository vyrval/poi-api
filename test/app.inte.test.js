import request from 'supertest';
import { server } from '../index.js';

describe('app', () => {
  after((done) => {
    server.close(done);
  });

  it('should return 200 and formatted object', (done) => {
    const input = [
      {
        lat: 48,
        lon: 2,
        name: 'PoiName1',
      },
    ];
    request(server)
      .get('/pois')
      .send(input)
      .expect(200, done);
  });
  it('should return 400 if input is not an array', (done) => {
    const input = 'hello';
    request(server)
      .get('/pois')
      .send(input)
      .expect(400, done);
  });
});
