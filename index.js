var program = require('commander');
var sickbeard = require('./lib/sickbeard');
var Promise = require('bluebird');
var Table = require('cli-table');
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs-extra'))
var plex = require('./lib/plex')

program
  .command('tv-ls')
  .description('list all tv shows')
  .action(function() {
    var table = new Table({
      head: ['ID', 'Show Name', 'Continuing']
    })

    Promise
      .resolve(sickbeard.getShows())
      .then(function(shows) {
        return _.chain(shows)
          .each(function(show) {
            var continuing = "✘";
            if (show.next_ep_airdate) {
              continuing = show.next_ep_airdate
            } else if (show.status == "Continuing") {
              continuing = "✔"
            }
            show.continuing = continuing
          })
          .sortBy("continuing")
          .value()
      })
      .each(function(show) {
        table.push([show.tvdbid, show.show_name, show.continuing]) 
      })
      .then(function() {
        console.log(table.toString())
      });
  })

program
  .command('tv-info <tvdbid>')
  .description('display info for show')
  .action(function(tvdbid) {
    var table = new Table({});

    Promise
      .resolve(sickbeard.getShow(tvdbid))
      .then(function(show) {
        console.log(show)
        var data = {
          'ID': tvdbid,
          'Show Name': show.show_name,
          'Network': show.network,
          'Location': show.location
        }
        _.each(data, function(value, key) {
          var d = {}
          d[key] = value
          table.push(d)
        })
      })
      .then(function() {
        console.log(table.toString())
      })
  })


program
  .command('tv-rm <tvdbid>')
  .description('delete a show')
  .action(function(tvdbid) {
    
    Promise
      .resolve(sickbeard.getShow(tvdbid))
      .then(function(show) {
        return Promise.all([
          sickbeard.deleteShow(tvdbid),
          fs.removeAsync(show.location)
        ])
      })
      .then(function() {
        return plex.refresh('show')
      })
      .then(function() {
        console.log("✔")
      })
  })

program.parse(process.argv);

