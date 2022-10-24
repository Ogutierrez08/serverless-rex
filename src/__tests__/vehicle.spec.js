const request = require('supertest')

describe('Test para functions/vehicle', () => {
  it('Integración con SWAPI endpoint /vehicle', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/swapi/vehicle')

    expect(result.statusCode).toBe(200)
  })

  it('Integración con SWAPI endpoint /vehicle/{id}', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/swapi/vehicle/4')

    expect(result.statusCode).toBe(200)
  })
})