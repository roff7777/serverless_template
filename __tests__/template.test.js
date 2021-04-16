/* eslint-disable no-undef */
'use strict'
const { demoServerless, unit } = require('../src/handler.js')

describe('tests', () => {
  beforeEach(() => { })

  // Unit Test
  it('unit test', async () => {
    // env variables are in .jest/envVars.js
    console.log('env: ', process.env.API_GATEWAY_ID)
    expect(await unit()).toEqual({
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false,
        'Access-Control-Allow-Methods': '*'
      },
      statusCode: 404,
      body: '{"status":404,"message":"error Message"}'
    })
  })

  it('integration test error basic auth', async () => {
    // env variables are in .jest/envVars.js
    console.log('env: ', process.env.API_GATEWAY_ID)
    let input = { body: { prueba: 'test' } }
    const user = 'user'
    const password = 'error'
    const auth = `${user}:${password}`
    const authEncoded = `Basic ${btoa(auth)}`
    input = {
      ...input,
      headers: {
        Authorization: authEncoded
      }
    }

    expect(await demoServerless(input)).toEqual({
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false,
        'Access-Control-Allow-Methods': '*'
      },
      statusCode: 401,
      body: '{"status":401,"message":"unauthorized"}'
    })
  })
})
