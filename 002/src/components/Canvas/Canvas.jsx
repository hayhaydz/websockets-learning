import useCanvas from '../../hooks/CanvasHook'

const Canvas = props =>  {
  const { draw, options, ...rest } = props;
  const { context, ...moreConfig } = options;
  const canvasRef = useCanvas(draw, {context});

  return <canvas ref={canvasRef} {...rest} style={{width: '100%', height: '100%'}}/>
}
export default Canvas
