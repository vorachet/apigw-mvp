require('dotenv').config({
  path: __dirname + "/../../.env"
})

const request = require('supertest')
const gw = require('../gw')
const mcv1 = require('../../mcv1')
const mcv2 = require('../../mcv2')

describe('MVP0 testset', () => {
  it('GW GET /', async () => {
    const response = await request(gw)
      .get("/")
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('GW POST /token with wrong user account', async () => {
    const response = await request(gw)
      .post("/token")
      .send({
        username: 'user',
        password: 'wrong',
        expiresIn: '1d'
      });
    expect(response.statusCode).toBe(401)
  })
  it('GW POST /token with valid user account', async () => {
    const response = await request(gw)
      .post("/token")
      .send({
        username: 'user',
        password: 'password',
        expiresIn: '1d'
      });
    expect(response.statusCode).toBe(200)
  })
  it('GW GET /secured with empty token', async () => {
    const response = await request(gw)
      .get("/secured")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('GW GET /secured with valid token', async () => {
    const response = await request(gw)
      .get("/secured")
      .set("Authorization", "Bearer " + process.env.TEST_TOKEN)
      .send();
    expect(response.statusCode).toBe(200)
  })

  it('mcv1 GET /', async () => {
    const response = await request(gw)
      .get("/mcv1")
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('mcv1 GET /secured with empty token', async () => {
    const response = await request(gw)
      .get("/secured-mcv1")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('mcv1 GET /secured with valid token', async () => {
    const response = await request(gw)
      .get("/secured-mcv1")
      .set("Authorization", "Bearer " + process.env.TEST_TOKEN)
      .send();
    expect(response.statusCode).toBe(200)
  })

  it('mcv2 GET /', async () => {
    const response = await request(gw)
      .get("/mcv2")
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('mcv2 GET /secured with empty token', async () => {
    const response = await request(gw)
      .get("/secured-mcv2")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('mcv2 GET /secured with valid token', async () => {
    const response = await request(gw)
      .get("/secured-mcv2")
      .set("Authorization", "Bearer " + process.env.TEST_TOKEN)
      .send();
    expect(response.statusCode).toBe(200) 
  })
})