var Promise = require('bluebird')
var request = Promise.promisifyAll(require('request'))
var config = require('../config');
var xmlParser = require('xml2json');

module.exports.getSections = function() {
  
  return request.getAsync({
    url: config.PLEX_URL + '/library/sections',
    strictSSL: false
  })
  .spread(function(response, body) {
    var data = xmlParser.toJson(body)
    data = JSON.parse(data)
    return data.MediaContainer.Directory
  })

}

module.exports.refresh = function(type) {

  return Promise
    .resolve(module.exports.getSections())
    .each(function(section) {
      if (type !== section.type) {
        return
      }
      return request.getAsync({
        url: config.PLEX_URL + '/library/sections/' + section.key + '/refresh'
      })
    })

}

