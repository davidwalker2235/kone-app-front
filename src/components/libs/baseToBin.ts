export const base64ToGLTF = (base64String: string): ArrayBuffer => {
    // Decodifica la cadena base64 a un array de bytes
    const binaryString = atob(base64String);

    // Convierte el array de bytes a un Uint8Array
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Convierte el Uint8Array a un ArrayBuffer
    const arrayBuffer = bytes.buffer;

    // Devuelve el ArrayBuffer para que puedas procesarlo
    return arrayBuffer;
}