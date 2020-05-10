const WebSocket = require('ws')
const {v4 : uuidv4} = require('uuid')

const wss = new WebSocket.Server({ port: process.env.PORT || 3001, host:'0.0.0.0' })

const sendToAll = (msg, condition) => {
  wss.clients.forEach(client => {
    if (client.readyState == 1 && condition == undefined || typeof condition === 'function' && condition(client))
      client.send(msg);      
  })
}
wss.on('connection', ws => {
  ws.on('message', message => {
    try {
      message = JSON.parse(message)
      if ('type' in message) {
        switch(message.type) {
          case 'CONNECT': 
            if (!('peerId' in ws)) {
              ws.peerId = message.peerId;
              sendToAll(JSON.stringify({type: 'CLIENT_CONNECT', peerId: ws.peerId}), (client) => client.peerId != ws.peerId);
            }
            break;
          default: 
            break;
        }
      }
    } catch {

    }
  })
})