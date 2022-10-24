const request = require('supertest')

describe('Test para functions/people', () => {
  it('Integración con SWAPI endpoint /people', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/swapi/people')

    expect(result.statusCode).toBe(200)
  })

  it('Integración con SWAPI endpoint /people/{id}', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/swapi/people/4')

    expect(result.statusCode).toBe(200)
  })
})