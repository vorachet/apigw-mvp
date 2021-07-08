const request = require('supertest')
const gw = require('../gw')

describe('MVP1 testset', () => {
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
        username: 'admin1',
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
    const tokenResp = await request(gw)
      .post("/token")
      .send({
        username: 'admin1',
        password: 'password',
        expiresIn: '1d'
      });
    expect(tokenResp.statusCode).toBe(200)
    const response = await request(gw)
      .get("/secured")
      .set("Authorization", "Bearer " + tokenResp.text)
      .send();
    expect(response.statusCode).toBe(200)
  })

  it('inventory GET /inventories with empty token', async () => {
    const response = await request(gw)
      .get("/inventories")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('inventory GET /inventories with valid token', async () => {
    const tokenResp = await request(gw)
      .post("/token")
      .send({
        username: 'admin1',
        password: 'password',
        expiresIn: '1d'
      });
    expect(tokenResp.statusCode).toBe(200)
    const response = await request(gw)
      .get("/inventories")
      .set("Authorization", "Bearer " + tokenResp.text)
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('inventory GET /inventory/1 with empty token', async () => {
    const response = await request(gw)
      .get("/inventory/1")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('inventory GET /inventory/1  with valid token', async () => {
    const tokenResp = await request(gw)
      .post("/token")
      .send({
        username: 'admin1',
        password: 'password',
        expiresIn: '1d'
      });
    expect(tokenResp.statusCode).toBe(200)
    const response = await request(gw)
      .get("/inventory/1")
      .set("Authorization", "Bearer " + tokenResp.text)
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('syslog GET /syslogs with empty token', async () => {
    const response = await request(gw)
      .get("/syslogs")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('syslog GET /syslogs with valid token', async () => {
    const tokenResp = await request(gw)
      .post("/token")
      .send({
        username: 'admin1',
        password: 'password',
        expiresIn: '1d'
      });
    expect(tokenResp.statusCode).toBe(200)
    const response = await request(gw)
      .get("/syslogs")
      .set("Authorization", "Bearer " + tokenResp.text)
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('syslog GET /syslog/admin1 with empty token', async () => {
    const response = await request(gw)
      .get("/syslog/admin1")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('syslog GET /syslog/admin1  with valid token', async () => {
    const tokenResp = await request(gw)
      .post("/token")
      .send({
        username: 'admin1',
        password: 'password',
        expiresIn: '1d'
      });
    expect(tokenResp.statusCode).toBe(200)
    const response = await request(gw)
      .get("/syslog/admin1")
      .set("Authorization", "Bearer " + tokenResp.text)
      .send();
    expect(response.statusCode).toBe(200)
  })
  it('syslog POST /syslog with empty token', async () => {
    const response = await request(gw)
      .post("/syslog")
      .send();
    expect(response.statusCode).toBe(401)
  })
  it('syslog POST /syslog  with valid token', async () => {
    const tokenResp = await request(gw)
      .post("/token")
      .send({
        username: 'admin1',
        password: 'password',
        expiresIn: '1d'
      });
    expect(tokenResp.statusCode).toBe(200)
    const response = await request(gw)
      .post("/syslog")
      .set("Authorization", "Bearer " + tokenResp.text)
      .send({
        publisher: 'admin1',
        category: 'apicall',
        event: 'apiname',
        message: {
          arg1:1, arg2: 2
        }
      });
    expect(response.statusCode).toBe(200)
  })


  
})