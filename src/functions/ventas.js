const { ventasService } = require('../services/ventasService')

const getVentas = (event, context, callback) => {
  ventasService(event, context, callback)
}

module.exports = { getVentas }