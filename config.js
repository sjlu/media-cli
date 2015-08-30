var _ = require('lodash');
var dotenv = require('dotenv');

dotenv.load();

var config = {
  SICKBEARD_URL: 'https://127.0.0.1/sickbeard',
  SICKBEARD_API_KEY: '41b5ed76b19054221b5b39e78fc27490',
  PLEX_URL: 'http://127.0.0.1:32400'
}

module.exports = _.defaults(process.env, config);
