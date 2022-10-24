const request = require('supertest')

describe('Test para functions/planet', () => {
  it('Integración con SWAPI endpoint /planet', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/swapi/planet')

    expect(result.statusCode).toBe(200)
  })

  it('Integración con SWAPI endpoint /planet/{id}', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/swapi/planet/2')

    expect(result.statusCode).toBe(200)
  })
})