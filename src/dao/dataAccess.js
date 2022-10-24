const {msrequest} = require('../connection/mssqlConn')
const {QUERY_CUBO_VENTAS} = require('../constants/cuboVentas')
const { errorResponse, response } = require('../utils/bodyResponseUtil')

const obtenerCuboVentas = async ( ) => {
    const result = await msrequest(QUERY_CUBO_VENTAS)
    return result
    
}


module.exports = {
    obtenerCuboVentas
}