window.onload = () => {
  const socket = new WebSocket('ws://localhost:1234');

  socket.onopen = e => {
    if(socket.readyState === WebSocket.OPEN) {
      socket.onmessage = message => {
        const { x, y, colour } = JSON.parse(message.data);

        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 15, 15);
        ctx.fillStyle = thisColour;
      }
    }
  }

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  const colours = [
    "#2ecc71",
    "#3498db",
    "#e74c3c",
    "#9b59b6",
    "#f39c12",
    "#ecf0f1",
  ];
  const thisColour = colours[Math.floor(Math.random() * (colours.length -1 + 1))];
  ctx.fillStyle = thisColour;

  let isMouseDown = false;
  canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
  });
  canvas.addEventListener('mouseup', () => (isMouseDown = false));

  canvas.addEventListener('mousemove', e => {
    if(isMouseDown) {
      ctx.fillRect(e.offsetX, e.offsetY, 15, 15);

      socket.send(
        JSON.stringify({
          x: e.offsetX,
          y: e.offsetY,
          colour: thisColour,
        })
      )
    }
  });
}
