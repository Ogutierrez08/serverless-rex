const request = require('supertest')

describe('Test para functions/character', () => {

  it('Ingresa un Character a la BD', async () => {

    const newCharacter = {
      "nombre": "Luke Skywalker",
      "genero": "Male",
      "peliculas": "https://swapi.py4e.com/api/films/1/",
      "color_ojo": "azul",
      "color_cabello": "Marrón",
      "color_piel": "Marrón",
      "altura": "172",
      "peso": "77",
      "planeta_natal": "https://swapi.py4e.com/api/planets/1/",
      "especies": "https://swapi.py4e.com/api/species/1/",
      "naves_estelares": "https://swapi.py4e.com/api/starships/12/",
      "vehiculos": "https://swapi.py4e.com/api/vehicles/14/",
      "url": "https://swapi.py4e.com/api/people/1/",
      "fecha_nacimiento": "10/10/1990"
  }
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .post('/add/character')
      .send(newCharacter)

    expect(result.statusCode).toBe(201)
  })


  it('Verifica obtener todos los characteres', async () => {
    const result = await request('https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com')
      .get('/list/characters')

    expect(result.statusCode).toBe(200)
  })
});