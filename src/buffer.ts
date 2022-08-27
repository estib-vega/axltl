export interface PrimitiveBuffers {
    position: WebGLBuffer;
    color: WebGLBuffer;
}

/**
 * Initialize an array buffer with the given information.
 * @param gl GL context
 * @param information Array of numeric values representing position or color information
 * @returns
 */
function initBuffer(gl: WebGLRenderingContext, information: number[]): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (buffer === null) {
        return null;
    }

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Now pass the list of information into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(information), gl.STATIC_DRAW);

    return buffer;
}

function createSquarePositionBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const positions = [
        1.0,  1.0, 0.0,
       -1.0,  1.0, 0.0,
        1.0, -1.0, 0.0,
       -1.0, -1.0, 0.0,
    ];
    return initBuffer(gl, positions);
}


function createSquareColorBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const colors = [
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  0.0,  1.0,    // red
        0.0,  1.0,  0.0,  1.0,    // green
        0.0,  0.0,  1.0,  1.0,    // blue
    ];
    return initBuffer(gl, colors);
}

export function createSquarePrimitiveBuffers(gl: WebGLRenderingContext): PrimitiveBuffers | null {
    const position = createSquarePositionBuffer(gl);
    const color = createSquareColorBuffer(gl);

    if (position === null || color === null) {
        return null;
    }

    return {
        position,
        color,
    }
}
