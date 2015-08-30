var config = require('../config');
var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

var defaultOpts = {
  url: config.SICKBEARD_URL + '/api/' + config.SICKBEARD_API_KEY,
  strictSSL: false,
  json: true
}

module.exports.getShows = function() {

  var opts = _.clone(defaultOpts)
  opts.url += '/shows'

  return request.getAsync(opts)
    .spread(function(response, body) {
      return _.map(body.data, function(data) {
        return data
      });
    });

}

module.exports.getShow = function(tvdbid) {

  var opts = _.clone(defaultOpts)
  opts.qs = {
    cmd: 'show',
    tvdbid: tvdbid
  }

  return request.getAsync(opts)
    .spread(function(response, body) {
      return body.data
    })

}

module.exports.deleteShow = function(tvdbid) {

  var opts = _.clone(defaultOpts)
  opts.qs = {
    cmd: 'show.delete',
    tvdbid: tvdbid
  }

  return request.getAsync(opts)

}
