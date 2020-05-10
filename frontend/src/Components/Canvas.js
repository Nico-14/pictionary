import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
const Canvas = forwardRef(({width, height, onChange}, ref) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lines = useRef([]); 

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';  
  }, []);

  const addLine = (x, y, color = 'red', width = 5, start) => {
    lines.current.push({x, y, color, width, start})
    onChange(lines.current[lines.current.length-1]);
  } 

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

  const reDraw = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < lines.current.length ; i++) {
      const line = lines.current[i];
      ctx.lineWidth = line.width;
      ctx.strokeStyle = line.color;
      ctx.beginPath(); 

      if (line.start) {
        ctx.moveTo(line.x, line.y);   
      } else {
        ctx.moveTo(lines.current[i-1].x, lines.current[i-1].y);   
      }
      ctx.lineTo(line.x, line.y);
      ctx.closePath();
      ctx.stroke();
    }
  }

  const handleDrawStart = (e) => {
    e.preventDefault();
    const {x, y} = getPosition(e);

    drawing.current = true;

    addLine(x, y, null, null, true);
    reDraw();
  }
  
  const handleDrawMove = (e ) => {
    e.preventDefault();
    if (!drawing.current) return;
    const {x, y} = getPosition(e);
    addLine(x, y);
    reDraw();
  }

  const handleDrawEnd = (e) => {
    drawing.current = false;
  }

  useImperativeHandle(ref, () => ({  
    loadLine(line) {
      lines.current.push(line)
      reDraw();
    } 
  }))

  return <canvas 
    ref={canvasRef} 
    width={width} 
    height={height} 
    style={{border: '1px solid red', touchAction: 'none'}}
    onMouseDown={handleDrawStart}
    onMouseMove={handleDrawMove}
    onMouseUp={handleDrawEnd}
    onMouseLeave={() => drawing.current = false}
    onTouchStart={handleDrawStart}
    onTouchMove={handleDrawMove}
    onTouchEnd={handleDrawEnd}
    onTouchCancel={handleDrawEnd}
  ></canvas>
})

export default Canvas;