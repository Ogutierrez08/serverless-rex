const response = (res, code) => {
  return {
    statusCode: code,
    body: JSON.stringify(res),
    headers: {
      "Content-Type": "application/json"
    }
  }
}

const errorResponse = (error) => {
  return {
    statusCode: error.status,
    body: JSON.stringify({
      message: error.title
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}

module.exports = {errorResponse, response}