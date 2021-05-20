/* eslint-disable no-console */
const { merge } = require('lodash')
const { pingDefs, pingRes } = require('../models/ping/ping')
require('dotenv').config()

module.exports.PORT = process.env.PORT
module.exports.typeDefs = [pingDefs]
module.exports.resolvers = merge(pingRes)
module.exports.logger = {
  requestDidStart(initialRequestContext) {
    const opName = initialRequestContext.request.operationName
    if (!opName) {
      console.log('Query: ', initialRequestContext.request.query)
    }
    return {
      executionDidStart() {
        return {
          willResolveField({ info }) {
            return (error, result) => {
              if (error) {
                console.log(`It failed with ${error}`)
              } else {
                console.log(`"${info.fieldName}": "${result}"`)
              }
            }
          },
        }
      },
    }
  },
}
