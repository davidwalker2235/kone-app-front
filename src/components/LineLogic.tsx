// LineLogic.tsx

export const drawLines = (
    contexto: CanvasRenderingContext2D,
    lineas: { inicio: { x: number; y: number }; fin: { x: number; y: number } }[]
  ) => {
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
  };
  
  export const drawPolygon = (
    contexto: CanvasRenderingContext2D,
    vertices: { x: number; y: number }[],
    mouseX?: number,
    mouseY?: number,
    polygonClosed?: boolean
  ) => {
    if (vertices.length === 0) return;
  
    contexto.beginPath();
    contexto.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      contexto.lineTo(vertices[i].x, vertices[i].y);
    }
  
    if (polygonClosed) {
      contexto.closePath();
    } else if (mouseX !== undefined && mouseY !== undefined) {
      contexto.lineTo(mouseX, mouseY);
    }
  
    contexto.strokeStyle = 'blue';
    contexto.lineWidth = 2;
    contexto.stroke();
  
    // Dibujar vértices
    vertices.forEach((vertice) => {
      contexto.beginPath();
      contexto.arc(vertice.x, vertice.y, 5, 0, Math.PI * 2);
      contexto.fillStyle = 'green';
      contexto.fill();
      contexto.closePath();
    });
  };
  
  export const hitTestVertex = (
    x: number,
    y: number,
    lineas: { inicio: { x: number; y: number }; fin: { x: number; y: number } }[]
  ) => {
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];
      const distanciaInicio = Math.hypot(x - linea.inicio.x, y - linea.inicio.y);
      const distanciaFin = Math.hypot(x - linea.fin.x, y - linea.fin.y);
      const radio = 5; // Radio del círculo (vértice)
      if (distanciaInicio <= radio) {
        return { indice: i, tipoVertice: 'inicio' as const };
      } else if (distanciaFin <= radio) {
        return { indice: i, tipoVertice: 'fin' as const };
      }
    }
    return null;
  };
  
  // Función para detectar si se ha hecho clic en un vértice de un polígono
  export const hitTestPolygonVertex = (
    x: number,
    y: number,
    vertices: { x: number; y: number }[]
  ) => {
    const radio = 5; // Radio del vértice
    for (let i = 0; i < vertices.length; i++) {
      const vertice = vertices[i];
      const distancia = Math.hypot(x - vertice.x, y - vertice.y);
      if (distancia <= radio) {
        return i; // Devolver el índice del vértice seleccionado
      }
    }
    return null;
  };
  
  export const clearCanvas = (canvas: HTMLCanvasElement) => {
    const contexto = canvas.getContext('2d');
    if (contexto) {
      contexto.clearRect(0, 0, canvas.width, canvas.height);
    }
  };