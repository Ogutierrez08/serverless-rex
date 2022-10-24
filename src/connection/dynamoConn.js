const AWS = require('aws-sdk')

const dynamoConnection = () => {
  return new Promise((resolve, reject) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    resolve(dynamodb)
  })

}

module.exports = { dynamoConnection }