const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const randomColor = () => {
  let r = Math.random() * 255;
  let g = Math.random() * 255;
  let b = Math.random() * 255;
  return `rgb(${r}, ${g}, ${b})`;
}

let color = randomColor();

const onPeerData = (id, data) => {
  draw(JSON.parse(data));
}

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const draw = data => {
    context.beginPath();
    context.moveTo(data.lastPoint.x, data.lastPoint.y);
    context.lineTo(data.x, data.y);
    context.strokeStyle = data.color;
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.stroke();
    context.closePath();
}

let lastPoint;

const move = e => {
    if(e.buttons) {
        if(!lastPoint) {
            lastPoint = { x: e.offsetX, y: e.offsetY };
            return;
        }

        draw({
          lastPoint,
          x: e.offsetX,
          y: e.offsetY,
          color: color
        });

        broadcast(JSON.stringify({
          lastPoint,
          x: e.offsetX,
          y: e.offsetY,
          color: color
        }))

        lastPoint = { x: e.offsetX, y: e.offsetY };
    }
}

const up = () => lastPoint = undefined;

const key = e => {
    if(e.key === 'Backspace') {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

window.onresize = resize;
window.onmousemove = move;
window.onmouseup = up;
window.onkeydown = key;

resize();
