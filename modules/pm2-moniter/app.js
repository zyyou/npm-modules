'use strict';

var pm2 = require('pm2');
var pmx = require('pmx');

// Get the configuration from PM2
var conf = pmx.initModule();

console.log(conf);


var moduelName = conf.module_name;

// Start listening on the PM2 BUS
pm2.launchBus(function (err, bus) {

  console.log('launchBus', err, bus);

  // Listen for process logs
  //if (conf.log) {
  bus.on('log:out', function (data) {
    if (data.process.name !== moduelName) {
      console.log({
        type: 'out',
        data: data
      });
    }
  });
  //}

  // Listen for process errors
  //if (conf.error) {
  bus.on('log:err', function (data) {
    if (data.process.name !== moduelName) {
      console.log({
        type: 'err',
        data: data
      });
    }
  });
  //}

  // Listen for PM2 kill
  //if (conf.kill) {
  bus.on('pm2:kill', function (data) {
    console.log({
      type: 'kill',
      data: data
    });
  });
  //}

  // Listen for process exceptions
  //if (conf.exception) {
  bus.on('process:exception', function (data) {
    if (data.process.name !== moduelName) {
      console.log({
        type: 'exception',
        data: data
      });
    }
  });
  //}


  // Listen for PM2 events
  bus.on('process:event', function (data) {
    if (conf[data.event]) {
      if (data.process.name !== moduelName) {
        console.log({
          type: 'event',
          data: data
        });
      }
    }
  });

  // Listen for PM2 events
  bus.on('process:msg', function (data) {
    if (conf[data.event]) {
      if (data.process.name !== moduelName) {
        console.log({
          type: 'msg',
          data: data
        });
      }
    }
  });

  // Start the message processing
  //processQueue();

});

pm2.reloadLogs(function (err, result) {
  console.log('reload', err, result);
})
