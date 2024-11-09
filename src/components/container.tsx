import React, { useRef, useState, useEffect } from 'react';

const Container = () => {
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

  const iniciarDibujo = (evento: any) => {
    const { offsetX, offsetY } = evento.nativeEvent;

    // Verificar si se hizo clic cerca de un vértice existente
    let verticeEncontrado = false;
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];

      const distanciaInicio = Math.hypot(offsetX - linea.inicio.x, offsetY - linea.inicio.y);
      const distanciaFin = Math.hypot(offsetX - linea.fin.x, offsetY - linea.fin.y);

      const radio = 5; // Radio del círculo (vértice)

      if (distanciaInicio <= radio) {
        // Clic cerca del vértice inicial
        setArrastrandoVertice(true);
        setIndiceLineaSeleccionada(i);
        setTipoVerticeSeleccionado('inicio');
        verticeEncontrado = true;
        break;
      } else if (distanciaFin <= radio) {
        // Clic cerca del vértice final
        setArrastrandoVertice(true);
        setIndiceLineaSeleccionada(i);
        setTipoVerticeSeleccionado('fin');
        verticeEncontrado = true;
        break;
      }
    }

    if (!verticeEncontrado) {
      // Iniciar una nueva línea
      setPosicionInicio({ x: offsetX, y: offsetY });
      setPosicionFin({ x: offsetX, y: offsetY });
      setDibujando(true);
    }
  };

  const finalizarDibujo = () => {
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
  };

  const dibujar = (mouseX?: number, mouseY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    // Limpiar el canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar todas las líneas existentes y sus vértices
    lineas.forEach((linea) => {
      // Dibujar línea
      contexto.beginPath();
      contexto.moveTo(linea.inicio.x, linea.inicio.y);
      contexto.lineTo(linea.fin.x, linea.fin.y);
      contexto.strokeStyle = 'black';
      contexto.lineWidth = 2;
      contexto.stroke();
      contexto.closePath();

      // Dibujar vértice inicial
      contexto.beginPath();
      contexto.arc(linea.inicio.x, linea.inicio.y, 5, 0, Math.PI * 2);
      contexto.fillStyle = 'red';
      contexto.fill();
      contexto.closePath();

      // Dibujar vértice final
      contexto.beginPath();
      contexto.arc(linea.fin.x, linea.fin.y, 5, 0, Math.PI * 2);
      contexto.fillStyle = 'red';
      contexto.fill();
      contexto.closePath();
    });

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
      dibujar();
    } else if (dibujando) {
      // Actualizar la posición final de la nueva línea
      setPosicionFin({ x: offsetX, y: offsetY });
      // Redibujar con las nuevas coordenadas
      dibujar(offsetX, offsetY);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dibujar inicialmente
    dibujar();
  }, []);

  useEffect(() => {
    // Redibujar cuando cambian las líneas
    dibujar();
  }, [lineas]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={iniciarDibujo}
      onMouseUp={finalizarDibujo}
      onMouseOut={finalizarDibujo}
      onMouseMove={manejarMovimiento}
      style={{ border: '1px solid #000' }}
    />
  );
};

export default Container;
