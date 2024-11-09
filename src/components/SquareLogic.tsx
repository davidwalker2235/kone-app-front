// SquareLogic.tsx

export const drawSquares = (
    contexto: CanvasRenderingContext2D,
    squares: { vertices: { x: number; y: number }[] }[]
  ) => {
    squares.forEach((square) => {
      const vertices = square.vertices;
      if (vertices.length === 0) return;
  
      contexto.beginPath();
      contexto.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        contexto.lineTo(vertices[i].x, vertices[i].y);
      }
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
    });
  };
  
  export const hitTestSquareVertex = (
    x: number,
    y: number,
    squares: { vertices: { x: number; y: number }[] }[]
  ) => {
    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      for (let j = 0; j < square.vertices.length; j++) {
        const vertice = square.vertices[j];
        const distancia = Math.hypot(x - vertice.x, y - vertice.y);
        const radio = 5; // Radio del vértice
        if (distancia <= radio) {
          return { indiceSquare: i, indiceVertice: j };
        }
      }
    }
    return null;
  };
  
  export const hitTestSquareEdge = (
    x: number,
    y: number,
    squares: { vertices: { x: number; y: number }[] }[]
  ): number | null => {
    const tolerancia = 5;
    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      const vertices = square.vertices;
      for (let j = 0; j < vertices.length - 1; j++) {
        const inicio = vertices[j];
        const fin = vertices[j + 1];
        if (isPointNearLine(inicio.x, inicio.y, fin.x, fin.y, x, y, tolerancia)) {
          return i;
        }
      }
    }
    return null;
  };
  
  // Función auxiliar para verificar si un punto está cerca de una línea
  const isPointNearLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    px: number,
    py: number,
    tolerancia: number
  ): boolean => {
    const longitudLinea = Math.hypot(x2 - x1, y2 - y1);
    if (longitudLinea === 0) return false; // Evitar división por cero
    const distancia =
      Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) / longitudLinea;
    return distancia <= tolerancia;
  };