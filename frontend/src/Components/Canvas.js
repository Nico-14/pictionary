import React, { useRef } from 'react';

const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  }
}


const Canvas = ({width, height}) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const moving = useRef(false);
  const points = useRef([]);
  const lines = useRef([]);

  const getPosition = e => {
    const rect = canvasRef.current.getBoundingClientRect();

    // use cursor pos as default
    let clientX = e.clientX;
    let clientY = e.clientY;

    // use first touch if available
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    // return mouse/touch position inside canvas
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const handleDrawStart = (e) => {
    const ctx = canvasRef.current.getContext('2d');
    
    const {x, y} = getPosition(e);

    ctx.lineJoin = 'round';
    ctx.lineCap  = 'round';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y);

    drawing.current = true;
    
    points.current.push(getPosition(e));
  }
  
  const handleDrawMove = (e ) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const {x, y} = getPosition(e);

    ctx.lineTo(x, y);
    ctx.stroke();

    moving.current = true;
  }

  const handleDrawEnd = (e) => {
    if (drawing.current) {
      drawing.current = false;
      if (moving.current) {
        moving.current = false
      } else {
        const ctx = canvasRef.current.getContext('2d'); 
        const {x, y} = getPosition(e);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }

  return <canvas 
    ref={canvasRef} 
    width={width} 
    height={height} 
    style={{border: '1px solid red'}}
    onMouseDown={handleDrawStart}
    onMouseMove={handleDrawMove}
    onMouseUp={handleDrawEnd}
  ></canvas>
}

export default Canvas;