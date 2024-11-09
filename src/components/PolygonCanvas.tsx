// PolygonCanvas.tsx

import React, { useEffect } from 'react';
import { drawPolygons } from './PolygonLogic';

type PolygonCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  poligonos: { x: number; y: number }[][];
  poligonoActual: { x: number; y: number }[];
  dibujandoPoligono: boolean;
  modoParedes: boolean;
};

const PolygonCanvas: React.FC<PolygonCanvasProps> = ({
  canvasRef,
  poligonos,
  poligonoActual,
  dibujandoPoligono,
  modoParedes,
}) => {
  useEffect(() => {
    draw();
  }, [poligonos, poligonoActual, dibujandoPoligono]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    // Dibujar polígonos existentes
    drawPolygons(contexto, poligonos);

    // Dibujar polígono en construcción si estamos en modo paredes
    if (dibujandoPoligono && poligonoActual.length > 0 && modoParedes) {
      drawPolygons(contexto, [poligonoActual]);
    }
  };

  return null; // Este componente no renderiza nada por sí mismo
};

export default PolygonCanvas;