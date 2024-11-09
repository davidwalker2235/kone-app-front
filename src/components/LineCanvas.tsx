// LineCanvas.tsx

import React, { useRef, useState, useEffect } from 'react';
import { drawLines, hitTestVertex } from './LineLogic';

type Line = {
  inicio: { x: number; y: number };
  fin: { x: number; y: number };
};

type LineCanvasProps = {
  modoDibujo: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  lineas: Line[];
  setLineas: React.Dispatch<React.SetStateAction<Line[]>>;
};

const LineCanvas: React.FC<LineCanvasProps> = ({
  modoDibujo,
  canvasRef,
  lineas,
  setLineas,
}) => {
  const [dibujando, setDibujando] = useState(false);
  const [posicionInicio, setPosicionInicio] = useState({ x: 0, y: 0 });
  const [posicionFin, setPosicionFin] = useState({ x: 0, y: 0 });
  const [arrastrandoVertice, setArrastrandoVertice] = useState(false);
  const [indiceLineaSeleccionada, setIndiceLineaSeleccionada] = useState<number | null>(null);
  const [tipoVerticeSeleccionado, setTipoVerticeSeleccionado] = useState<'inicio' | 'fin' | null>(
    null
  );

  useEffect(() => {
    draw();
  }, [lineas, dibujando, posicionFin]);

  const iniciarInteraccion = (evento: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    if (modoDibujo) {
      // Iniciar una nueva línea
      setPosicionInicio({ x: offsetX, y: offsetY });
      setPosicionFin({ x: offsetX, y: offsetY });
      setDibujando(true);
    } else {
      // Verificar si se hizo clic cerca de un vértice existente para moverlo
      const resultado = hitTestVertex(offsetX, offsetY, lineas);
      if (resultado) {
        setArrastrandoVertice(true);
        setIndiceLineaSeleccionada(resultado.indice);
        setTipoVerticeSeleccionado(resultado.tipoVertice);
      }
    }
  };

  const finalizarInteraccion = () => {
    if (dibujando) {
      // Calcular la distancia entre el inicio y el fin de la línea
      const distancia = Math.hypot(
        posicionFin.x - posicionInicio.x,
        posicionFin.y - posicionInicio.y
      );

      // Solo agregar la línea si la distancia es mayor que cero
      if (distancia > 0) {
        // Agregar nueva línea al finalizar el dibujo
        const nuevaLinea = {
          inicio: posicionInicio,
          fin: posicionFin,
        };
        setLineas([...lineas, nuevaLinea]);
      }
      setDibujando(false);
    }
    if (arrastrandoVertice) {
      setArrastrandoVertice(false);
      setIndiceLineaSeleccionada(null);
      setTipoVerticeSeleccionado(null);
    }
  };

  const manejarMovimiento = (evento: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    if (arrastrandoVertice && indiceLineaSeleccionada !== null && tipoVerticeSeleccionado) {
      // Actualizar la posición del vértice que se está arrastrando
      const nuevasLineas = [...lineas];
      const linea = nuevasLineas[indiceLineaSeleccionada];

      if (tipoVerticeSeleccionado === 'inicio') {
        linea.inicio = { x: offsetX, y: offsetY };
      } else if (tipoVerticeSeleccionado === 'fin') {
        linea.fin = { x: offsetX, y: offsetY };
      }

      setLineas(nuevasLineas);
      // Redibujar el canvas
      draw();
    } else if (dibujando) {
      // Actualizar la posición final de la nueva línea
      setPosicionFin({ x: offsetX, y: offsetY });
      // Redibujar con las nuevas coordenadas
      draw();
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    // Limpiar el canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar todas las líneas existentes y sus vértices
    drawLines(contexto, lineas);

    // Si estamos dibujando una nueva línea, la dibujamos SOLO SI HAY MOVIMIENTO
    if (dibujando) {
      const distancia = Math.hypot(
        posicionFin.x - posicionInicio.x,
        posicionFin.y - posicionInicio.y
      );

      if (distancia > 0) {
        // Dibujar línea en curso
        contexto.beginPath();
        contexto.moveTo(posicionInicio.x, posicionInicio.y);
        contexto.lineTo(posicionFin.x, posicionFin.y);
        contexto.strokeStyle = 'black';
        contexto.lineWidth = 2;
        contexto.stroke();
        contexto.closePath();

        // Dibujar vértice inicial
        contexto.beginPath();
        contexto.arc(posicionInicio.x, posicionInicio.y, 5, 0, Math.PI * 2);
        contexto.fillStyle = 'red';
        contexto.fill();
        contexto.closePath();

        // Dibujar vértice final
        contexto.beginPath();
        contexto.arc(posicionFin.x, posicionFin.y, 5, 0, Math.PI * 2);
        contexto.fillStyle = 'red';
        contexto.fill();
        contexto.closePath();
      }
    }
  };

  return (
    <>
      {/* Los eventos solo se conectan si estamos en modo dibujo o manipulando líneas */}
      {modoDibujo || arrastrandoVertice ? (
        <canvas
          ref={canvasRef}
          onMouseDown={iniciarInteraccion}
          onMouseUp={finalizarInteraccion}
          onMouseOut={finalizarInteraccion}
          onMouseMove={manejarMovimiento}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      ) : null}
    </>
  );
};

export default LineCanvas;