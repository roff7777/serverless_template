'use strict'
const querystring = require('querystring')

/**
 * get parses queryparams or request's body into an object
 * @param {String} data containing request body as delivered by AWS
 * @returns {Object} with parsed data into JSON object
 */
const get = data => {
  let response = false
  if (data) {
    try {
      response = JSON.parse(data)
    } catch(err){
      response = JSON.parse(JSON.stringify(querystring.parse(data)))
    }
  }
  console.log(JSON.stringify(response))
  return response
}

module.exports = { get }
