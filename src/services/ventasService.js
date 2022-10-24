const { obtenerCuboVentas } = require('../dao/dataAccess')
const { errorResponse, response } = require('../utils/bodyResponseUtil')

const ventasService = async (event, context, callback) => {
  try {
    const response = await obtenerCuboVentas()
    callback(null, response(...response, 200))
  } catch (error) {
    callback(null, errorResponse(error))
  }
}

module.exports = {ventasService}