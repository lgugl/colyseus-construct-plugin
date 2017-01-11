"use strict";

var colyseus = require('colyseus')
    // , http = require('http')
    , koa = require('koa')

    , log = require('./util/debug')()

    , app = koa()
    // , host
    , port = 3000
    // , server = http.createServer()
    , gameServer = new colyseus.Server({port: port});

// const NODE_ENV = process.env.NODE_ENV;

// server.listen(port, host, () => {log.info('Server connected on ' + host + ':' + port)})

let gameRoomOptions = {
    maxClients: 2
}
gameServer.register('game_room', require('./game_room'), gameRoomOptions);

log.info('server ready')
