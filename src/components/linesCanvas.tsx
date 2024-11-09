import { useCallback, useEffect, useRef, useState } from "react";
import { useDraw } from "./hooks/useDraw";

const currentLineInitialState = {
    start: null,
    end: null
  };
  
  interface LinesCanvasProps {
    canvasElementSize: any,
    canvasBitmapSize: any,
    onLineListUpdated: (lineList: any[]) => void,
  }
  
  const LinesCanvas: React.FC<LinesCanvasProps> = ({
                                                     canvasElementSize,
                                                     canvasBitmapSize,
                                                     onLineListUpdated
                                                   }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
      drawLine,
      drawMultipleLines,
      clearCanvas,
      getCanvasMouseCoordinates,
      getLineDirectionEndPoint
    } = useDraw();
    const [lineList, setLineList] = useState<any[]>([]);
    const [currentLine, setCurrentLine] = useState<any>(currentLineInitialState);
  
    const handleLineListUpdated = useCallback((lineList: any[]) => {
      setLineList(lineList);
      if (onLineListUpdated) {
        onLineListUpdated(lineList);
      }
    }, [onLineListUpdated]);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      clearCanvas(ctx, canvas);
      drawMultipleLines(ctx, lineList);
  
      if (currentLine.start && currentLine.end) {
        drawLine({ctx, line: currentLine, color: 'black'});
      }
    }, [lineList, currentLine, clearCanvas, drawMultipleLines, drawLine]);
  
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || currentLine.start) return;
  
      const canvasMouseCoordinates = getCanvasMouseCoordinates(e, canvasRef.current);
  
      if (!canvasMouseCoordinates) return;
  
      setCurrentLine({
        start: canvasMouseCoordinates,
        end: canvasMouseCoordinates,
      });
    }, [currentLine.start, getCanvasMouseCoordinates]);
  
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!currentLine.start || !canvasRef.current) return;
  
      setCurrentLine({
        start: currentLine.start,
        end: getLineDirectionEndPoint(getCanvasMouseCoordinates(e, canvasRef.current)!, currentLine)
      });
    }, [currentLine, getCanvasMouseCoordinates]);
  
    const handleMouseUp = useCallback(() => {
      if (!currentLine.start || !currentLine.end) return;
  
      handleLineListUpdated([...lineList, {start: currentLine.start, end: currentLine.end}]);
      setCurrentLine({start: null, end: null});
    }, [currentLine, lineList, handleLineListUpdated]);
  
    return (
      <canvas
        ref={canvasRef}
        width={canvasBitmapSize.width}
        height={canvasBitmapSize.height}
        style={{
          width: canvasElementSize.width,
          height: canvasElementSize.height,
          border: '2px solid red',
          background: 'white',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-testid="canvas-test"
      />
    );
  };
  
  LinesCanvas.defaultProps = {
    canvasElementSize: {width: 600, height: 400},
    canvasBitmapSize: {width: 900, height: 600},
    onLineListUpdated: () => {
    }
  }
  
  export default LinesCanvas;