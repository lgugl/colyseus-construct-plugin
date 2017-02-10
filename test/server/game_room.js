var Room = require('colyseus').Room
  , log = require('./util/debug')('game-room')

class GameRoom extends Room {

  constructor (options) {
    super( options )

    // Broadcast patched state to all connected clients at 20fps (50ms)
    // this.setPatchRate(100)//why it doesn't trigger onUpdate event?

    // Call game simulation at 60fps (16.6ms)
    this.setSimulationInterval( this.tick.bind(this), 1000 / 60 )

    this.setState({time: 0})

    this.time = 0
    this.timer = 0
  }

  requestJoin(options) {

    // only allow a max number of clients per room
    return this.clients.length < this.options.maxClients;
  }

  onJoin (client, data) {
    log.info(client.id, "joined room", this.options.roomId)
    log.trace("There is/are", this.clients.length, "client(s) in this room")

    this.send(client, "Hello " + data.name)
    this.broadcastOthers(client, "A new challenger has just enter ("+client.id+")")
  }

  onMessage (client, data) {
    log(client.id, "sent a message:", data)
    switch (data) {

      case "Ping":
        this.send(client, "Pong")
        break;

      case "Poke":
        this.broadcastOthers(client, "Poke (by "+client.id+")")
        break;

      default:
        break;
    }
  }

  tick () {
    let now = Date.now()
    if (!this.time) {
        this.time = now
    }

    let dt = now - this.time
    this.time = now

    this.timer += dt
    if (this.timer >= 4000) {
        this.timer = 0
        // log('tick',dt, this.time)
        this.setState({time: this.time})
        this.clients.forEach((client) => {
          this.sendState(client)
        })
    }
  }

  onLeave (client) {
    log.info("Client",client.id,"left the room",this.options.roomId)
  }

  onDispose () {
    log.info("Room",this.options.roomId,"is empty");
  }

  broadcastOthers (client, data) {
    for(let clt of this.clients) {
      if (clt.id != client.id) {
        this.send(clt, data)
      }
    }
  }

}

module.exports = GameRoom
