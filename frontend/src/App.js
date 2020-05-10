import React, { useRef, useEffect, useCallback, useState } from 'react';
import './App.css';
import Lobby from './Components/Lobby';
import Canvas from './Components/Canvas';
import Peer from 'peerjs';
import CanvasDraw from "react-canvas-draw";

function App() {
  const ws = useRef(new WebSocket("ws://" + window.location.hostname + ":3001/"));
  const peer = useRef(new Peer(null, {debug: 2}));
  const canvasRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [log, setLog] = useState("");

  useEffect(() => {
    const connect = (peerId) => {
      const connection = peer.current.connect(peerId);
      connection.on('open', () => {
        setLog(log => (log +'Cliente ' + peerId + ' conectado\n'))
        setConnections(connections => [...connections, connection]); 
      })
    }

    peer.current.on('open', function(id) {
      ws.current.send(JSON.stringify({type: 'CONNECT', peerId: id}))
      peer.current.on('connection', conn => {
        conn.on('open', () => {
          setConnections(connections => [...connections, conn]); 
        })
      })
    });

    ws.current.onopen = () => {

    }

    ws.current.onmessage = e => {
      try {
        const message = JSON.parse(e.data)
        if ('type' in message) {
          switch(message.type) {
            case 'CLIENT_CONNECT':  //Cuando un cliente externo se conecta
              connect(message.peerId);
              break;
            default: 
              break;
          }
        }
      } catch {
  
      }
    }

    for (const connection of connections) {
      connection.on('data', (data) => {
        canvasRef.current.loadLine(data);
      });
      connection.on('close', () => {
        setConnections(connections => connections.filter(connec => connec.peer !== connection.peer))
      });
    }
  }, [connections, setConnections])

  const handleCanvasOnChange = (line) => {
    for (const connection of connections) {
      if (connection.open) {
        connection.send(line);
      }
    }
  }
  
  return (
    <div className="App">
      <h1>Clients: {connections.filter(conn => conn.open).length + 1}</h1>
      <Canvas ref={canvasRef} width="520" height="520" onChange={handleCanvasOnChange}></Canvas>
      {/* <CanvasDraw brushRadius={3} onChange={handleCanvasOnChange} immediateLoading={true} hideInterface={true} ref={canvas}></CanvasDraw> */}
      {/* <Lobby></Lobby> */}

      {/*      <canvas ref={canvas} width="400" height="400">

      </canvas> */}
      <textarea rows="20" cols="50" value={log} onChange={(e) => setLog(e.currentTarget.value)} disabled></textarea>
    </div>
  );
}

export default App;
