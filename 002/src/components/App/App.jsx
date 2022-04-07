import { Canvas } from '../';

const App = () => {
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
    ctx.fill();
  }

  const options = {
    context: '2d'
  }

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Canvas draw={draw} options={options}/>
    </div>
  )
}
export default App
