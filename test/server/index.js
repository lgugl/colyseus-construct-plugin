'use strict';

var colyseus = require('colyseus')
  , log = require('./util/debug')('server')
  , port = 3000
  , gameServer = new colyseus.Server({port: port});

let gameRoomOptions = {
  maxClients: 2
};
gameServer.register('game_room', require('./game_room'), gameRoomOptions);

log.info('Server ready on port', port);
