'use strict'

/**
 * errorBodyResponse returns an object understood by AWS as an error response
 * @param {String} type error type
 * @param {Number} status error http code
 * @param {String} code error code
 * @param {String} detail error detail
 * @param {String} message error message
 * @returns {Object} object describing http response 
 */
const errorBodyResponse = (type, status, code, detail, message) => {
  const body = JSON.stringify({
    type,
    status,
    code,
    detail,
    message
  })

  console.log(body)

  return {
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': false,
      'Access-Control-Allow-Methods': '*'
    },
    statusCode: status,
    body
  }
}

/**
 * buildResponse handler for unexpected errors
 * @param {Object} err object matching http response format
 * @returns {Object} same as received or created a valid 500 error object
 */
const buildErrorResponse = (err) => {
  console.log(err)
  if (err.statusCode) {
    return err
  } 
  return errorResponse(500, err.message, {})
  
}

/**
 * errorResponse abstracts errorBodyResponse's functionality in a simple interface
 * @param {Number} statusCode http response code
 * @param {String} message custom error message
 * @param {String} errorObject object matching the enum format we have for errors
 * @returns {Object} as returned by errorBodyResponse
 */
const errorResponse = (statusCode, message, errorObject) => {
  return errorBodyResponse(
    errorObject.TYPE,
    statusCode,
    errorObject.CODE,
    errorObject.DETAIL,
    message
  )
}

/**
 * successResponse prepares the response in case everything worked perfectly
 * @param {String|Object} message is either a json with requested details or a success message
 * @returns {Object} valid request response object
 */
const successResponse = async message => {
  const msg = typeof message !== 'string' ? JSON.stringify(message) : message
  return {
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': false,
      'Access-Control-Allow-Methods': '*'
    },
    statusCode: 200,
    body: msg
  }
}

module.exports = {
  errorBodyResponse,
  errorResponse,
  successResponse,
  buildErrorResponse
}
