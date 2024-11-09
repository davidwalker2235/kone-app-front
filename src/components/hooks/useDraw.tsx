export const useDraw = () => {
    const drawLine = ({ctx, line, color}: any) => {
      if (!ctx) return;
      if (!line.start || !line.end) return;
  
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    };
  
    const drawMultipleLines = (ctx: CanvasRenderingContext2D, lineList: any[]) => {
      if (!ctx) return;
      if (!lineList || lineList.length === 0) return;
  
      lineList.forEach(line => drawLine({ctx, line, color: 'black'}));
    };
  
    const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      if (!ctx || !canvas) return;
      const {width, height} = canvas;
      ctx.clearRect(0, 0, width, height);
    };
  
    const getCanvasMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement | null) => {
      if (!canvas) return null;
  
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const offsetX = (e.clientX - rect.left) * scaleX;
      const offsetY = (e.clientY - rect.top) * scaleY;
  
      return {x: offsetX, y: offsetY};
    };
  
    const getLineDirectionEndPoint = (mousePoint: any, currentLine: any) => {
      if (!currentLine.start) return null;
      const xDiff = Math.abs(mousePoint.x - currentLine.start.x);
      const yDiff = Math.abs(mousePoint.y - currentLine.start.y);
      return {
        x: xDiff > yDiff ? mousePoint.x : currentLine.start.x,
        y: xDiff > yDiff ? currentLine.start.y : mousePoint.y,
      };
    };
  
    return {
      drawLine,
      drawMultipleLines,
      clearCanvas,
      getCanvasMouseCoordinates,
      getLineDirectionEndPoint
    };
  };