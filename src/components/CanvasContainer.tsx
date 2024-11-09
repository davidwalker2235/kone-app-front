import React, { useRef, useState, useEffect } from 'react';
import {
  drawLines,
  hitTestVertex,
  clearCanvas,
  drawPolygon,
  hitTestPolygonVertex,
} from './LineLogic';

const CanvasContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estados para el dibujo de líneas
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

  // Modos de dibujo
  const [modoDibujo, setModoDibujo] = useState(false); // Modo de dibujo de líneas
  const [modoParedes, setModoParedes] = useState(false); // Modo de dibujo de paredes (polígonos)

  // Nuevo estado para manejar múltiples polígonos
  const [poligonos, setPoligonos] = useState<{ x: number; y: number }[][]>([]);
  const [poligonoActual, setPoligonoActual] = useState<{ x: number; y: number }[]>([]);
  const [polygonClosed, setPolygonClosed] = useState(false);

  // Estados para arrastrar vértices del polígono
  const [arrastrandoVerticePared, setArrastrandoVerticePared] = useState(false);
  const [indicePoligonoSeleccionado, setIndicePoligonoSeleccionado] = useState<number | null>(null);
  const [indiceVerticeParedSeleccionado, setIndiceVerticeParedSeleccionado] = useState<number | null>(null);

  const iniciarInteraccion = (evento: any) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    // Priorizar el modo dibujo
    if (modoDibujo) {
      // Iniciar una nueva línea
      setPosicionInicio({ x: offsetX, y: offsetY });
      setPosicionFin({ x: offsetX, y: offsetY });
      setDibujando(true);
    } else if (modoParedes) {
      if (poligonoActual.length === 0) {
        // Primer vértice
        setPoligonoActual([{ x: offsetX, y: offsetY }]);
      } else {
        // Verificar si se hizo clic en el primer vértice para cerrar el polígono
        const distanciaPrimerVertice = Math.hypot(
          offsetX - poligonoActual[0].x,
          offsetY - poligonoActual[0].y
        );
        const radio = 5;
        if (distanciaPrimerVertice <= radio) {
          // Agregar el primer vértice al final para cerrar el polígono
          const nuevoPoligono = [...poligonoActual, poligonoActual[0]];
          setPoligonoActual(nuevoPoligono);
          setPolygonClosed(true); // Marcar el polígono como cerrado

          // Agregar el polígono a la lista de polígonos
          setPoligonos([...poligonos, nuevoPoligono]);
          setPoligonoActual([]); // Reiniciar el polígono actual
          setModoParedes(false);
        } else {
          // Agregar nuevo vértice al polígono actual
          setPoligonoActual([...poligonoActual, { x: offsetX, y: offsetY }]);
        }
      }
    } else {
      // Si no estamos en modo dibujo ni en modo paredes
      // Verificar si se hizo clic cerca de un vértice de algún polígono
      for (let i = 0; i < poligonos.length; i++) {
        const poligono = poligonos[i];
        const indiceVertice = hitTestPolygonVertex(offsetX, offsetY, poligono);
        if (indiceVertice !== null) {
          setArrastrandoVerticePared(true);
          setIndicePoligonoSeleccionado(i);
          setIndiceVerticeParedSeleccionado(indiceVertice);
          return;
        }
      }

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
    if (arrastrandoVerticePared) {
      setArrastrandoVerticePared(false);
      setIndiceVerticeParedSeleccionado(null);
      setIndicePoligonoSeleccionado(null);
    }
  };

  const manejarMovimiento = (evento: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    if (arrastrandoVerticePared && indicePoligonoSeleccionado !== null && indiceVerticeParedSeleccionado !== null) {
      // Actualizar la posición del vértice que se está arrastrando
      const nuevosPoligonos = [...poligonos];
      const poligono = nuevosPoligonos[indicePoligonoSeleccionado];
      poligono[indiceVerticeParedSeleccionado] = { x: offsetX, y: offsetY };

      // Si se mueve el primer o último vértice, actualizar ambos
      if (indiceVerticeParedSeleccionado === 0) {
        poligono[poligono.length - 1] = { x: offsetX, y: offsetY };
      } else if (indiceVerticeParedSeleccionado === poligono.length - 1) {
        poligono[0] = { x: offsetX, y: offsetY };
      }

      setPoligonos(nuevosPoligonos);
      // Redibujar el canvas
      draw();
    } else if (modoParedes && poligonoActual.length > 0) {
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
      draw();
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

    // Dibujar todos los polígonos existentes
    poligonos.forEach((poligono) => {
      drawPolygon(contexto, poligono, undefined, undefined, true);
    });

    // Dibujar el polígono en construcción
    if (modoParedes && poligonoActual.length > 0) {
      drawPolygon(contexto, poligonoActual, mouseX, mouseY, false);
    }

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dibujar inicialmente
    draw();
  }, []);

  useEffect(() => {
    // Redibujar cuando cambian las líneas o los polígonos
    draw();
  }, [lineas, poligonos, poligonoActual]);

  const handleActivarDibujo = () => {
    setModoDibujo(!modoDibujo);
    setModoParedes(false); // Desactivar modo paredes si estaba activo
  };

  const handleActivarParedes = () => {
    setModoParedes(!modoParedes);
    setModoDibujo(false); // Desactivar modo dibujo si estaba activo
    // No reiniciar los polígonos existentes
    if (!modoParedes) {
      // Si estamos activando el modo paredes, reiniciar el polígono actual
      setPoligonoActual([]);
      setPolygonClosed(false);
    }
  };

  const handleLimpiarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearCanvas(canvas);
    setLineas([]);
    setPoligonos([]);
    setPoligonoActual([]);
    setPolygonClosed(false);
  };

  const handleMostrarCoordenadas = () => {
    // Coordenadas de los vértices de las líneas
    const verticesLineas = lineas.flatMap((linea) => [linea.inicio, linea.fin]);
    console.log('Coordenadas de los vértices de las líneas:', verticesLineas);

    // Coordenadas de los polígonos
    console.log('Coordenadas de los polígonos:', poligonos);
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
      <button onClick={handleMostrarCoordenadas}>Mostrar Coordenadas</button>
      <canvas
        ref={canvasRef}
        onMouseDown={iniciarInteraccion}
        onMouseUp={finalizarInteraccion}
        onMouseOut={finalizarInteraccion}
        onMouseMove={manejarMovimiento}
        style={{ border: '1px solid #000', cursor: modoDibujo || modoParedes ? 'crosshair' : 'default' }}
      />

      {/* Mostrar coordenadas en la interfaz */}
      <div>
        <h3>Coordenadas de los vértices de las líneas:</h3>
        <ul>
          {lineas.map((linea, index) => (
            <li key={index}>
              Línea {index + 1}:
              Inicio ({linea.inicio.x.toFixed(2)}, {linea.inicio.y.toFixed(2)})
              - Fin ({linea.fin.x.toFixed(2)}, {linea.fin.y.toFixed(2)})
            </li>
          ))}
        </ul>

        <h3>Coordenadas de los polígonos:</h3>
        {poligonos.map((poligono, i) => (
          <div key={i}>
            <h4>Polígono {i + 1}:</h4>
            <ul>
              {poligono.map((vertice, index) => (
                <li key={index}>
                  Vértice {index + 1}: ({vertice.x.toFixed(2)}, {vertice.y.toFixed(2)})
                  {index === poligono.length - 1 && index !== 0 && ' (Igual al Vértice 1)'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasContainer;