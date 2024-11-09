// PolygonLogic.tsx

export const drawPolygons = (
    contexto: CanvasRenderingContext2D,
    poligonos: { x: number; y: number }[][]
  ) => {
    poligonos.forEach((vertices) => {
      drawPolygon(contexto, vertices);
    });
  };
  
  export const drawPolygon = (
    contexto: CanvasRenderingContext2D,
    vertices: { x: number; y: number }[],
    mouseX?: number,
    mouseY?: number
  ) => {
    if (vertices.length === 0) return;
  
    contexto.beginPath();
    contexto.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      contexto.lineTo(vertices[i].x, vertices[i].y);
    }
  
    if (mouseX !== undefined && mouseY !== undefined) {
      contexto.lineTo(mouseX, mouseY);
    } else {
      contexto.closePath();
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
  
  export const hitTestPolygonsVertex = (
    x: number,
    y: number,
    poligonos: { x: number; y: number }[][]
  ) => {
    const radio = 5; // Radio del vértice
    for (let j = 0; j < poligonos.length; j++) {
      const vertices = poligonos[j];
      for (let i = 0; i < vertices.length; i++) {
        const vertice = vertices[i];
        const distancia = Math.hypot(x - vertice.x, y - vertice.y);
        if (distancia <= radio) {
          return { indicePoligono: j, indiceVertice: i };
        }
      }
    }
    return null;
  };
  
  // Nueva función para detectar si se ha hecho clic cerca de un borde de polígono
  export const hitTestPolygonEdge = (
    x: number,
    y: number,
    poligonos: { x: number; y: number }[][]
  ): number | null => {
    const tolerancia = 5; // Distancia máxima para considerar que el clic está cerca de un borde
    for (let j = 0; j < poligonos.length; j++) {
      const vertices = poligonos[j];
      for (let i = 0; i < vertices.length - 1; i++) {
        const vInicio = vertices[i];
        const vFin = vertices[i + 1];
        if (isPointNearLine(vInicio.x, vInicio.y, vFin.x, vFin.y, x, y, tolerancia)) {
          return j; // Devolver el índice del polígono
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