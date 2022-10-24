const axios = require('axios').default;

const request = (endpoint) => {
  return new Promise((resolve, reject) => {
    var config = {
      method: 'get',
      url: endpoint
    };
    axios(config)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      });
  })

}

module.exports = { request }