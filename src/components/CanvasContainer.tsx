// CanvasContainer.tsx

import React, { useRef, useState, useEffect } from 'react';
import {
  drawLines,
  hitTestVertex,
  hitTestLine,
} from './LineLogic';
import {
  drawPolygons,
  hitTestPolygonsVertex,
  hitTestPolygonEdge,
} from './PolygonLogic';
import {
  drawSquares,
  hitTestSquareVertex,
  hitTestSquareEdge,
} from './SquareLogic';
import { clearCanvas } from './CanvasLogic';

const CanvasContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Modos de dibujo
  const [modoDibujo, setModoDibujo] = useState(false);
  const [modoParedes, setModoParedes] = useState(false);
  const [modoCuadrado, setModoCuadrado] = useState(false); // Nuevo estado para modo cuadrado
  const [modoBorrar, setModoBorrar] = useState(false);

  // Estados para líneas
  const [lineas, setLineas] = useState<
    { inicio: { x: number; y: number }; fin: { x: number; y: number } }[]
  >([]);
  const [dibujandoLinea, setDibujandoLinea] = useState(false);
  const [posicionInicioLinea, setPosicionInicioLinea] = useState({ x: 0, y: 0 });
  const [posicionFinLinea, setPosicionFinLinea] = useState({ x: 0, y: 0 });
  const [arrastrandoVerticeLinea, setArrastrandoVerticeLinea] = useState(false);
  const [indiceLineaSeleccionada, setIndiceLineaSeleccionada] = useState<number | null>(null);
  const [tipoVerticeLineaSeleccionado, setTipoVerticeLineaSeleccionado] = useState<'inicio' | 'fin' | null>(null);

  // Estados para polígonos
  const [poligonos, setPoligonos] = useState<{ x: number; y: number }[][]>([]);
  const [poligonoActual, setPoligonoActual] = useState<{ x: number; y: number }[]>([]);
  const [dibujandoPoligono, setDibujandoPoligono] = useState(false);
  const [arrastrandoVerticePoligono, setArrastrandoVerticePoligono] = useState(false);
  const [indicePoligonoSeleccionado, setIndicePoligonoSeleccionado] = useState<number | null>(null);
  const [indiceVerticePoligonoSeleccionado, setIndiceVerticePoligonoSeleccionado] = useState<number | null>(null);

  // Estados para cuadrados
  const [squares, setSquares] = useState<{ vertices: { x: number; y: number }[] }[]>([]);
  const [dibujandoCuadrado, setDibujandoCuadrado] = useState(false);
  const [pasoCuadrado, setPasoCuadrado] = useState(1);
  const [posicionPrimerVerticeCuadrado, setPosicionPrimerVerticeCuadrado] = useState({ x: 0, y: 0 });
  const [posicionSegundoVerticeCuadrado, setPosicionSegundoVerticeCuadrado] = useState({ x: 0, y: 0 });
  const [arrastrandoVerticeCuadrado, setArrastrandoVerticeCuadrado] = useState(false);
  const [indiceSquareSeleccionado, setIndiceSquareSeleccionado] = useState<number | null>(null);
  const [indiceVerticeSquareSeleccionado, setIndiceVerticeSquareSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Inicializar el contexto y dibujar
    draw();
  }, []);

  useEffect(() => {
    draw();
  }, [
    lineas,
    poligonos,
    poligonoActual,
    dibujandoLinea,
    posicionFinLinea,
    squares,
    dibujandoCuadrado,
  ]);

  const iniciarInteraccion = (evento: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    if (modoBorrar) {
      // Verificar si se hizo clic en un borde de algún polígono
      const indicePoligono = hitTestPolygonEdge(offsetX, offsetY, poligonos);
      if (indicePoligono !== null) {
        // Eliminar el polígono
        const nuevosPoligonos = [...poligonos];
        nuevosPoligonos.splice(indicePoligono, 1);
        setPoligonos(nuevosPoligonos);
        draw();
        return;
      }

      // Verificar si se hizo clic en alguna línea
      const indiceLinea = hitTestLine(offsetX, offsetY, lineas);
      if (indiceLinea !== null) {
        // Eliminar la línea
        const nuevasLineas = [...lineas];
        nuevasLineas.splice(indiceLinea, 1);
        setLineas(nuevasLineas);
        draw();
        return;
      }

      // Verificar si se hizo clic en un borde de algún cuadrado
      const indiceSquare = hitTestSquareEdge(offsetX, offsetY, squares);
      if (indiceSquare !== null) {
        // Eliminar el cuadrado
        const nuevosSquares = [...squares];
        nuevosSquares.splice(indiceSquare, 1);
        setSquares(nuevosSquares);
        draw();
      }

      return; // Salir de la función ya que estamos en modo borrar
    }

    if (modoCuadrado) {
      if (!dibujandoCuadrado) {
        // Primer clic
        setPosicionPrimerVerticeCuadrado({ x: offsetX, y: offsetY });
        setDibujandoCuadrado(true);
        setPasoCuadrado(2);
      } else if (pasoCuadrado === 2) {
        // Segundo clic
        setPosicionSegundoVerticeCuadrado({ x: offsetX, y: offsetY });
        setPasoCuadrado(3);
      } else if (pasoCuadrado === 3) {
        // Tercer clic
        const vertex1 = posicionPrimerVerticeCuadrado;
        const vertex2 = posicionSegundoVerticeCuadrado;
        const vertex3Input = { x: offsetX, y: offsetY };

        // Cálculo del cuadrado
        const baseVector = {
          x: vertex2.x - vertex1.x,
          y: vertex2.y - vertex1.y,
        };

        // Vector perpendicular a la base
        const perpVector = {
          x: -baseVector.y,
          y: baseVector.x,
        };

        // Calcular la altura proyectando el vector desde vertex1 a vertex3Input sobre el vector perpendicular
        const heightVector = {
          x: vertex3Input.x - vertex1.x,
          y: vertex3Input.y - vertex1.y,
        };

        // Proyección escalar de heightVector sobre perpVector
        const dotProduct = heightVector.x * perpVector.x + heightVector.y * perpVector.y;
        const perpLengthSquared = perpVector.x ** 2 + perpVector.y ** 2;
        const scale = dotProduct / perpLengthSquared;

        // Vector perpendicular escalado
        const scaledPerpVector = {
          x: perpVector.x * scale,
          y: perpVector.y * scale,
        };

        // Calcular los otros dos vértices
        const vertex3 = {
          x: vertex2.x + scaledPerpVector.x,
          y: vertex2.y + scaledPerpVector.y,
        };
        const vertex4 = {
          x: vertex1.x + scaledPerpVector.x,
          y: vertex1.y + scaledPerpVector.y,
        };

        // Agregar el quinto vértice igual al primero
        const vertex5 = { ...vertex1 };

        const newSquare = {
          vertices: [vertex1, vertex2, vertex3, vertex4, vertex5], // Agregar vertex5
        };

        setSquares([...squares, newSquare]);

        // Reiniciar estados
        setDibujandoCuadrado(false);
        setPasoCuadrado(1);
      }

      return; // Salir ya que estamos en modo cuadrado
    }

    if (modoDibujo) {
      // Iniciar una nueva línea
      setPosicionInicioLinea({ x: offsetX, y: offsetY });
      setPosicionFinLinea({ x: offsetX, y: offsetY });
      setDibujandoLinea(true);
    } else if (modoParedes) {
      if (!dibujandoPoligono) {
        setPoligonoActual([{ x: offsetX, y: offsetY }]);
        setDibujandoPoligono(true);
      } else {
        // Verificar si se hizo clic en el primer vértice para cerrar el polígono
        const distanciaPrimerVertice = Math.hypot(
          offsetX - poligonoActual[0].x,
          offsetY - poligonoActual[0].y
        );
        const radio = 5;
        if (distanciaPrimerVertice <= radio) {
          // Cerrar el polígono
          const nuevoPoligono = [...poligonoActual, poligonoActual[0]];
          setPoligonos([...poligonos, nuevoPoligono]);
          setPoligonoActual([]);
          setDibujandoPoligono(false);
          setModoParedes(false);
        } else {
          // Agregar nuevo vértice
          setPoligonoActual([...poligonoActual, { x: offsetX, y: offsetY }]);
        }
      }
    } else {
      // Verificar si se hizo clic en un vértice de algún polígono
      const resultadoPoligono = hitTestPolygonsVertex(offsetX, offsetY, poligonos);
      if (resultadoPoligono) {
        setArrastrandoVerticePoligono(true);
        setIndicePoligonoSeleccionado(resultadoPoligono.indicePoligono);
        setIndiceVerticePoligonoSeleccionado(resultadoPoligono.indiceVertice);
        return;
      }

      // Verificar si se hizo clic en un vértice de alguna línea
      const resultadoLinea = hitTestVertex(offsetX, offsetY, lineas);
      if (resultadoLinea) {
        setArrastrandoVerticeLinea(true);
        setIndiceLineaSeleccionada(resultadoLinea.indice);
        setTipoVerticeLineaSeleccionado(resultadoLinea.tipoVertice);
        return;
      }

      // Verificar si se hizo clic en un vértice de algún cuadrado
      const resultadoSquare = hitTestSquareVertex(offsetX, offsetY, squares);
      if (resultadoSquare) {
        setArrastrandoVerticeCuadrado(true);
        setIndiceSquareSeleccionado(resultadoSquare.indiceSquare);
        setIndiceVerticeSquareSeleccionado(resultadoSquare.indiceVertice);
        return;
      }
    }
  };

  const finalizarInteraccion = () => {
    if (dibujandoLinea) {
      // Agregar línea si tiene distancia mayor a cero
      const distancia = Math.hypot(
        posicionFinLinea.x - posicionInicioLinea.x,
        posicionFinLinea.y - posicionInicioLinea.y
      );

      if (distancia > 0) {
        const nuevaLinea = {
          inicio: posicionInicioLinea,
          fin: posicionFinLinea,
        };
        setLineas([...lineas, nuevaLinea]);
      }
      setDibujandoLinea(false);
    }

    if (arrastrandoVerticeLinea) {
      setArrastrandoVerticeLinea(false);
      setIndiceLineaSeleccionada(null);
      setTipoVerticeLineaSeleccionado(null);
    }

    if (arrastrandoVerticePoligono) {
      setArrastrandoVerticePoligono(false);
      setIndicePoligonoSeleccionado(null);
      setIndiceVerticePoligonoSeleccionado(null);
    }

    if (arrastrandoVerticeCuadrado) {
      setArrastrandoVerticeCuadrado(false);
      setIndiceSquareSeleccionado(null);
      setIndiceVerticeSquareSeleccionado(null);
    }
  };

  const manejarMovimiento = (evento: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    if (dibujandoLinea) {
      setPosicionFinLinea({ x: offsetX, y: offsetY });
    } else if (dibujandoPoligono) {
      draw(offsetX, offsetY);
    } else if (dibujandoCuadrado && modoCuadrado) {
      draw(offsetX, offsetY);
    } else if (arrastrandoVerticeLinea && indiceLineaSeleccionada !== null && tipoVerticeLineaSeleccionado) {
      // Actualizar posición del vértice de la línea
      const nuevasLineas = [...lineas];
      const linea = nuevasLineas[indiceLineaSeleccionada];

      if (tipoVerticeLineaSeleccionado === 'inicio') {
        linea.inicio = { x: offsetX, y: offsetY };
      } else if (tipoVerticeLineaSeleccionado === 'fin') {
        linea.fin = { x: offsetX, y: offsetY };
      }

      setLineas(nuevasLineas);
      draw(); // Redibujar el canvas para reflejar los cambios
    } else if (
      arrastrandoVerticePoligono &&
      indicePoligonoSeleccionado !== null &&
      indiceVerticePoligonoSeleccionado !== null
    ) {
      // Actualizar posición del vértice del polígono
      const nuevosPoligonos = [...poligonos];
      const poligono = nuevosPoligonos[indicePoligonoSeleccionado];
      poligono[indiceVerticePoligonoSeleccionado] = { x: offsetX, y: offsetY };

      // Si es el primer o último vértice, actualizar ambos
      if (indiceVerticePoligonoSeleccionado === 0) {
        poligono[poligono.length - 1] = { x: offsetX, y: offsetY };
      } else if (indiceVerticePoligonoSeleccionado === poligono.length - 1) {
        poligono[0] = { x: offsetX, y: offsetY };
      }

      setPoligonos(nuevosPoligonos);
      draw(); // Redibujar el canvas para reflejar los cambios
    } else if (
      arrastrandoVerticeCuadrado &&
      indiceSquareSeleccionado !== null &&
      indiceVerticeSquareSeleccionado !== null
    ) {
      // Actualizar posición del vértice del cuadrado
      const nuevosSquares = [...squares];
      const square = nuevosSquares[indiceSquareSeleccionado];
      square.vertices[indiceVerticeSquareSeleccionado] = { x: offsetX, y: offsetY };

      // Si es el primer o último vértice, actualizar ambos
      if (indiceVerticeSquareSeleccionado === 0) {
        square.vertices[square.vertices.length - 1] = { x: offsetX, y: offsetY };
      } else if (indiceVerticeSquareSeleccionado === square.vertices.length - 1) {
        square.vertices[0] = { x: offsetX, y: offsetY };
      }

      setSquares(nuevosSquares);
      draw(); // Redibujar el canvas para reflejar los cambios
    }
  };

  const draw = (mouseX?: number, mouseY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    // Limpiar el canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar líneas
    drawLines(contexto, lineas);

    // Dibujar polígonos
    drawPolygons(contexto, poligonos);

    // Dibujar cuadrados
    drawSquares(contexto, squares);

    // Dibujar polígono en construcción
    if (dibujandoPoligono && poligonoActual.length > 0) {
      const poligono = [...poligonoActual];
      if (mouseX !== undefined && mouseY !== undefined) {
        poligono.push({ x: mouseX, y: mouseY });
      }
      drawPolygons(contexto, [poligono]);
    }

    // Dibujar línea en curso
    if (dibujandoLinea) {
      const distancia = Math.hypot(
        posicionFinLinea.x - posicionInicioLinea.x,
        posicionFinLinea.y - posicionInicioLinea.y
      );

      if (distancia > 0) {
        contexto.beginPath();
        contexto.moveTo(posicionInicioLinea.x, posicionInicioLinea.y);
        contexto.lineTo(posicionFinLinea.x, posicionFinLinea.y);
        contexto.strokeStyle = 'black';
        contexto.lineWidth = 2;
        contexto.stroke();
        contexto.closePath();

        // Dibujar vértices
        contexto.beginPath();
        contexto.arc(posicionInicioLinea.x, posicionInicioLinea.y, 5, 0, Math.PI * 2);
        contexto.fillStyle = 'red';
        contexto.fill();
        contexto.closePath();

        contexto.beginPath();
        contexto.arc(posicionFinLinea.x, posicionFinLinea.y, 5, 0, Math.PI * 2);
        contexto.fillStyle = 'red';
        contexto.fill();
        contexto.closePath();
      }
    }

    // Dibujar cuadrado en curso
    if (dibujandoCuadrado && modoCuadrado) {
      if (pasoCuadrado === 2) {
        // Dibujar base del cuadrado
        contexto.beginPath();
        contexto.moveTo(posicionPrimerVerticeCuadrado.x, posicionPrimerVerticeCuadrado.y);
        contexto.lineTo(mouseX!, mouseY!);
        contexto.strokeStyle = 'black';
        contexto.lineWidth = 2;
        contexto.stroke();
        contexto.closePath();

        // Dibujar vértices
        contexto.beginPath();
        contexto.arc(posicionPrimerVerticeCuadrado.x, posicionPrimerVerticeCuadrado.y, 5, 0, Math.PI * 2);
        contexto.fillStyle = 'blue';
        contexto.fill();
        contexto.closePath();

        contexto.beginPath();
        contexto.arc(mouseX!, mouseY!, 5, 0, Math.PI * 2);
        contexto.fillStyle = 'blue';
        contexto.fill();
        contexto.closePath();
      } else if (pasoCuadrado === 3) {
        const vertex1 = posicionPrimerVerticeCuadrado;
        const vertex2 = posicionSegundoVerticeCuadrado;
        const vertex3Input = { x: mouseX!, y: mouseY! };

        // Cálculo provisional del cuadrado para mostrarlo mientras se mueve el ratón
        const baseVector = {
          x: vertex2.x - vertex1.x,
          y: vertex2.y - vertex1.y,
        };
        const perpVector = {
          x: -baseVector.y,
          y: baseVector.x,
        };

        const heightVector = {
          x: vertex3Input.x - vertex1.x,
          y: vertex3Input.y - vertex1.y,
        };
        const dotProduct = heightVector.x * perpVector.x + heightVector.y * perpVector.y;
        const perpLengthSquared = perpVector.x ** 2 + perpVector.y ** 2;
        const scale = dotProduct / perpLengthSquared;

        const scaledPerpVector = {
          x: perpVector.x * scale,
          y: perpVector.y * scale,
        };

        const vertex3 = {
          x: vertex2.x + scaledPerpVector.x,
          y: vertex2.y + scaledPerpVector.y,
        };
        const vertex4 = {
          x: vertex1.x + scaledPerpVector.x,
          y: vertex1.y + scaledPerpVector.y,
        };

        // Agregar el quinto vértice igual al primero
        const vertex5 = { ...vertex1 };

        const vertices = [vertex1, vertex2, vertex3, vertex4, vertex5];

        // Dibujar cuadrado
        contexto.beginPath();
        contexto.moveTo(vertices[0].x, vertices[0].y);
        vertices.forEach((vertice, index) => {
          if (index > 0) {
            contexto.lineTo(vertice.x, vertice.y);
          }
        });
        contexto.closePath();
        contexto.strokeStyle = 'black';
        contexto.lineWidth = 2;
        contexto.stroke();

        // Dibujar vértices
        vertices.forEach((vertice) => {
          contexto.beginPath();
          contexto.arc(vertice.x, vertice.y, 5, 0, Math.PI * 2);
          contexto.fillStyle = 'blue';
          contexto.fill();
          contexto.closePath();
        });
      }
    }
  };

  const handleActivarDibujo = () => {
    setModoDibujo(!modoDibujo);
    if (modoParedes) setModoParedes(false);
    if (modoBorrar) setModoBorrar(false);
    if (modoCuadrado) setModoCuadrado(false);
  };

  const handleActivarParedes = () => {
    setModoParedes(!modoParedes);
    if (modoDibujo) setModoDibujo(false);
    if (modoBorrar) setModoBorrar(false);
    if (modoCuadrado) setModoCuadrado(false);
    if (!modoParedes) {
      setPoligonoActual([]);
      setDibujandoPoligono(false);
    }
  };

  const handleActivarCuadrado = () => {
    setModoCuadrado(!modoCuadrado);
    if (modoDibujo) setModoDibujo(false);
    if (modoParedes) setModoParedes(false);
    if (modoBorrar) setModoBorrar(false);
    if (!modoCuadrado) {
      setDibujandoCuadrado(false);
      setPasoCuadrado(1);
    }
  };

  const handleActivarBorrar = () => {
    setModoBorrar(!modoBorrar);
    if (modoDibujo) setModoDibujo(false);
    if (modoParedes) setModoParedes(false);
    if (modoCuadrado) setModoCuadrado(false);
  };

  const handleLimpiarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearCanvas(canvas);
    setLineas([]);
    setPoligonos([]);
    setSquares([]);
    setPoligonoActual([]);
  };

  const handleMostrarCoordenadas = () => {
    console.log('Coordenadas de los vértices de las líneas:', lineas);
    console.log('Coordenadas de los polígonos:', poligonos);
    console.log('Coordenadas de los cuadrados:', squares);
  };

  return (
    <div>
      <button
        onClick={handleActivarDibujo}
        style={{ backgroundColor: modoDibujo ? 'green' : 'initial' }}
      >
        {modoDibujo ? '✎' : '✎'}
      </button>
      <button
        onClick={handleActivarParedes}
        style={{ backgroundColor: modoParedes ? 'green' : 'initial' }}
      >
        {modoParedes ? '📐' : '📐'}
      </button>
      <button
        onClick={handleActivarCuadrado}
        style={{ backgroundColor: modoCuadrado ? 'green' : 'initial' }}
      >
        {modoCuadrado ? '🔳' : '🔳'}
      </button>
      <button
        onClick={handleActivarBorrar}
        style={{ backgroundColor: modoBorrar ? 'red' : 'initial' }}
      >
        🗑
      </button>
      <button onClick={handleLimpiarCanvas}>Clean screen</button>
      <button onClick={handleMostrarCoordenadas}>Show coordenates</button>

      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #000',
          cursor:
            modoDibujo || modoParedes || modoCuadrado
              ? 'crosshair'
              : modoBorrar
              ? 'pointer'
              : 'default',
        }}
        onMouseDown={iniciarInteraccion}
        onMouseUp={finalizarInteraccion}
        onMouseOut={finalizarInteraccion}
        onMouseMove={manejarMovimiento}
      />

      {/* Mostrar coordenadas en la interfaz */}
      <div>
        <h3>Coordenadas de los vértices de las líneas:</h3>
        <ul>
          {lineas.map((linea, index) => (
            <li key={index}>
              Línea {index + 1}:
              Inicio ({linea.inicio.x.toFixed(2)}, {linea.inicio.y.toFixed(2)}) -
              Fin ({linea.fin.x.toFixed(2)}, {linea.fin.y.toFixed(2)})
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

        <h3>Coordenadas de los cuadrados:</h3>
        {squares.map((square, i) => (
          <div key={i}>
            <h4>Cuadrado {i + 1}:</h4>
            <ul>
              {square.vertices.map((vertice, index) => (
                <li key={index}>
                  Vértice {index + 1}: ({vertice.x.toFixed(2)}, {vertice.y.toFixed(2)})
                  {index === square.vertices.length - 1 && index !== 0 && ' (Igual al Vértice 1)'}
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