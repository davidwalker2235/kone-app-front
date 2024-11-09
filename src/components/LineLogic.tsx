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
  
      // Dibujar vértices
      contexto.beginPath();
      contexto.arc(linea.inicio.x, linea.inicio.y, 5, 0, Math.PI * 2);
      contexto.fillStyle = 'red';
      contexto.fill();
      contexto.closePath();
  
      contexto.beginPath();
      contexto.arc(linea.fin.x, linea.fin.y, 5, 0, Math.PI * 2);
      contexto.fillStyle = 'red';
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
      const radio = 5; // Radio del vértice
      if (distanciaInicio <= radio) {
        return { indice: i, tipoVertice: 'inicio' as const };
      } else if (distanciaFin <= radio) {
        return { indice: i, tipoVertice: 'fin' as const };
      }
    }
    return null;
  };
  
  // Nueva función para detectar si se ha hecho clic cerca de una línea
  export const hitTestLine = (
    x: number,
    y: number,
    lineas: { inicio: { x: number; y: number }; fin: { x: number; y: number } }[]
  ): number | null => {
    const tolerancia = 5; // Distancia máxima para considerar que el clic está cerca de la línea
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];
      if (
        isPointNearLine(linea.inicio.x, linea.inicio.y, linea.fin.x, linea.fin.y, x, y, tolerancia)
      ) {
        return i; // Devolver el índice de la línea
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