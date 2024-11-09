import React, { useRef, useState, useEffect } from 'react';
import { drawLines, hitTestVertex, clearCanvas, drawPolygon } from './LineLogic';

const CanvasContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dibujando, setDibujando] = useState(false);
  const [posicionInicio, setPosicionInicio] = useState({ x: 0, y: 0 });
  const [posicionFin, setPosicionFin] = useState({ x: 0, y: 0 });
  const [lineas, setLineas] = useState<
    { inicio: { x: number; y: number }; fin: { x: number; y: number } }[]
  >([]);

  const [arrastrandoVertice, setArrastrandoVertice] = useState(false);
  const [indiceLineaSeleccionada, setIndiceLineaSeleccionada] = useState<number | null>(null);
  const [tipoVerticeSeleccionado, setTipoVerticeSeleccionado] = useState<'inicio' | 'fin' | null>(
    null
  );

  const [modoDibujo, setModoDibujo] = useState(false); // Modo de dibujo de líneas
  const [modoParedes, setModoParedes] = useState(false); // Modo de dibujo de paredes (polígonos)
  const [verticesPared, setVerticesPared] = useState<{ x: number; y: number }[]>([]);
  const [cerrarPared, setCerrarPared] = useState(false);

  const iniciarInteraccion = (evento: any) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    // Verificar si se está en modo paredes
    if (modoParedes) {
      if (verticesPared.length === 0) {
        // Primer vértice
        setVerticesPared([{ x: offsetX, y: offsetY }]);
      } else {
        // Verificar si se hizo clic en el primer vértice para cerrar el polígono
        const distanciaPrimerVertice = Math.hypot(
          offsetX - verticesPared[0].x,
          offsetY - verticesPared[0].y
        );
        const radio = 5;
        if (distanciaPrimerVertice <= radio) {
          setCerrarPared(true);
          setModoParedes(false);
        } else {
          // Agregar nuevo vértice
          setVerticesPared([...verticesPared, { x: offsetX, y: offsetY }]);
        }
      }
    } else {
      // Verificar si se hizo clic cerca de un vértice existente para moverlo
      const resultado = hitTestVertex(offsetX, offsetY, lineas);
      if (resultado) {
        setArrastrandoVertice(true);
        setIndiceLineaSeleccionada(resultado.indice);
        setTipoVerticeSeleccionado(resultado.tipoVertice);
      } else if (modoDibujo) {
        // Iniciar una nueva línea
        setPosicionInicio({ x: offsetX, y: offsetY });
        setPosicionFin({ x: offsetX, y: offsetY });
        setDibujando(true);
      }
    }
  };

  const finalizarInteraccion = () => {
    if (dibujando) {
      // Agregar nueva línea al finalizar el dibujo
      const nuevaLinea = {
        inicio: posicionInicio,
        fin: posicionFin,
      };
      setLineas([...lineas, nuevaLinea]);
      setDibujando(false);
    }
    if (arrastrandoVertice) {
      setArrastrandoVertice(false);
      setIndiceLineaSeleccionada(null);
      setTipoVerticeSeleccionado(null);
    }
    if (cerrarPared) {
      setCerrarPared(false);
    }
  };

  const manejarMovimiento = (evento: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    if (modoParedes && verticesPared.length > 0) {
      // Redibujar el polígono en construcción
      draw(offsetX, offsetY);
    } else if (arrastrandoVertice && indiceLineaSeleccionada !== null && tipoVerticeSeleccionado) {
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
      draw(offsetX, offsetY);
    }
  };

  const draw = (mouseX?: number, mouseY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    // Limpiar el canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar todas las líneas existentes y sus vértices
    drawLines(contexto, lineas);

    // Dibujar el polígono en construcción
    if (verticesPared.length > 0) {
      drawPolygon(contexto, verticesPared, mouseX, mouseY, cerrarPared);
    }

    // Si estamos dibujando una nueva línea, la dibujamos
    if (dibujando) {
      // Dibujar línea en curso
      contexto.beginPath();
      contexto.moveTo(posicionInicio.x, posicionInicio.y);
      contexto.lineTo(mouseX as number, mouseY as number);
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

      // Dibujar vértice final en la posición actual del ratón
      contexto.beginPath();
      contexto.arc(mouseX as number, mouseY as number, 5, 0, Math.PI * 2);
      contexto.fillStyle = 'red';
      contexto.fill();
      contexto.closePath();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dibujar inicialmente
    draw();
  }, []);

  useEffect(() => {
    // Redibujar cuando cambian las líneas o los vértices del polígono
    draw();
  }, [lineas, verticesPared]);

  const handleActivarDibujo = () => {
    setModoDibujo(!modoDibujo);
    setModoParedes(false); // Desactivar modo paredes si estaba activo
  };

  const handleActivarParedes = () => {
    setModoParedes(!modoParedes);
    setModoDibujo(false); // Desactivar modo dibujo si estaba activo
    setVerticesPared([]);
  };

  const handleLimpiarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearCanvas(canvas);
    setLineas([]);
    setVerticesPared([]);
  };

  return (
    <div>
      <button onClick={handleActivarDibujo}>
        {modoDibujo ? 'Desactivar Dibujo' : 'Activar Dibujo'}
      </button>
      <button onClick={handleActivarParedes}>
        {modoParedes ? 'Desactivar Paredes' : 'Activar Paredes'}
      </button>
      <button onClick={handleLimpiarCanvas}>Limpiar Pantalla</button>
      <canvas
        ref={canvasRef}
        onMouseDown={iniciarInteraccion}
        onMouseUp={finalizarInteraccion}
        onMouseOut={finalizarInteraccion}
        onMouseMove={manejarMovimiento}
        style={{ border: '1px solid #000', cursor: modoDibujo || modoParedes ? 'crosshair' : 'default' }}
      />
    </div>
  );
};

export default CanvasContainer;