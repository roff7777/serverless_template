'use strict'
const customResponse = require('./utils/CustomResponse')
const { verifyAuthorization } = require('./utils/BasicAuth')

/**
 * demoServerless is auth validated endpoint
 * @param {Object} event object containing the entire request information
 * @returns {Object} either success or error response object
 */
const demoServerless = async (event) => {
  const authorizationHeader = event.headers.Authorization
  try {
    console.log('authorizationHeader: ', authorizationHeader)
    const verify = verifyAuthorization(authorizationHeader)
    console.log('verify: ', verify)
    console.log(customResponse.successResponse('success'))
    return customResponse.successResponse('success')
  } catch (error) {
    return error
  }
}

/**
 * unit is a simple error returning lambda
 * @returns {Object} either success or error response object
 */
const unit = async () => {
  return customResponse.errorResponse(404, 'error Message', {})
}

module.exports = {
  demoServerless,
  unit
}
