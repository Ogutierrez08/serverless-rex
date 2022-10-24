const sql = require('mssql')

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SEVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: false, // change to true for local dev / self-signed certs
        parseJSON: true
    }
}


const msrequest = async (query) => {
    try {
        // console.log(sqlConfig)
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig)
        const result = await sql.query(query)
        // console.log(`El resultado de la query es...${JSON.stringify(result)}`)
        const data = JSON.parse(result.recordset[0].data)
        return data
    } catch (err) {
        console.log(err)
    }
}

module.exports = { msrequest }