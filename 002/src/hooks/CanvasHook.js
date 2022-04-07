import { useRef, useEffect } from 'react'

const resizeCanvasToDisplay = (canvas, ctx) => {
  const { width, height } = canvas.getBoundingClientRect();

  if(canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio:ratio=1 } = window;
    canvas.width = width*ratio;
    canvas.height = height*ratio;
    ctx.scale(ratio, ratio);
    return true;
  }

  return false;
}

const useCanvas = (draw, options={}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext(options.context || '2d');
    let frameCount = 0;
    let animationFrameID;

    const render = () => {
      frameCount++;
      resizeCanvasToDisplay(canvas, ctx);
      draw(ctx, frameCount);
      animationFrameID = window.requestAnimationFrame(render)
    }
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameID);
    }

    draw(ctx);
  }, [draw]);

  return canvasRef
}
export default useCanvas
