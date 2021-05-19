const { pingDefs, pingRes } = require('../models/ping/ping')
const { merge } = require('lodash')

module.exports.typeDefs = [pingDefs]
module.exports.resolvers = merge(pingRes)
