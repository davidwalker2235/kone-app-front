export const clearCanvas = (canvas: HTMLCanvasElement) => {
    const contexto = canvas.getContext('2d');
    if (contexto) {
      contexto.clearRect(0, 0, canvas.width, canvas.height);
    }
  };