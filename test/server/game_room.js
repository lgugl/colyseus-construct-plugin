var Room = require('colyseus').Room
  , log = require('./util/debug')('game-room')

class GameRoom extends Room {

  constructor (options) {
    super( options )

    // Broadcast patched state to all connected clients at 20fps (50ms)
    // this.setPatchRate( 2000 )

    // Call game simulation at 60fps (16.6ms)
    // this.setSimulationInterval( this.tick.bind(this), 1000 / 60 )

    this.setState({})

    this.time = 0
    this.timer = 0
  }

  requestJoin(options) {
    // reconnection to the room

    for(let client of this.clients) {
        if (client.id == options.uid) {
            log.trace('client', options.uid, 'found on room', this.options.roomId)
            return true;
        }
    }

    // log.trace('request with options', options)
    // this.clients.forEach((client) => {
    //   if (client.id == options.uid) {
    //       log.trace('client', options.uid, 'found on room', this.options.roomId)
    //       // to keep the client's current score
    //       this.foo = {
    //           score: client.score
    //       }
    //       this._onLeave(client, false)
    //       return true;
    //   }
    // })

    // only allow a max number of clients per room
    return this.clients.length < this.options.maxClients;
  }

  onJoin (client, data) {

        // to keep the client's current score on reconnection
        let score;
        // try to find this client and remove it
        // (so a very short moment there is one more client in the room
        // and if somebody try to connect in the exactly same moment
        // the room may be full)
        this.clients.forEach((val) => {
          if (val.id == data.uid) {
              score = val.score
              this._onLeave(val, false)
          }
        })
        // // add UID to the client object
        // client.uid = data.uid
        client.score = score || data.score



        // client.score = this.foo.score || 0


    log.info(client.id, "joined room", this.options.roomId, "with a score of", client.score)
    log.trace("there is/are", this.clients.length, "client(s) in this room")
    // this.send(client, "Hello " + client.id)
    this.broadcast("A new challenger ("+client.id+") has just enter.")


    client.score++
  }

  onMessage (client, data) {
    log(client.id, "sent message on room:", data)
    switch (data) {
      case "Ping":
        this.send(client, "Pong")
        break;
      default:
        break;
    }
  }

  tick () {
    //
    // This is your 'game loop'.
    // Inside function you'll have to run the simulation of your game.
    //
    // You should:
    // - move entities
    // - check for collisions
    // - update the state
    //

    let now = Date.now()
    if (!this.time) {
        this.time = now
    }

    let dt = now - this.time
    this.time = now

    this.timer += dt
    if (this.timer >= 1000) {
        this.timer = 0
        log('tick',dt)
    }




  }

  onLeave (client) {
    log.info(client.id, "left room")
  }

  onDispose () {
    log.info("Room",this.options.roomId,"is empty");
  }

}

module.exports = GameRoom
