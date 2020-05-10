'use strict'

class Room {
  constructor() {
    this.players = [];
    this.round = 1;
  }

  addPlayer(peerId, drawing) {
    this.players.push({peerId, drawing})
  }

  getPeerPainter() {
    for (const player of this.players) {
      if (player.drawing) return player.peerId;
    }
  }

}

module.exports = Room;