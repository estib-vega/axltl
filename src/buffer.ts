export interface PrimitiveBuffers {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
}

/**
 * Initialize an array buffer with the given information.
 *
 * @param gl GL context
 * @param information Array of numeric values representing position or color information
 * @returns
 */
function initArrayBuffer(gl: WebGLRenderingContext, information: number[]): WebGLBuffer | null {
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

/**
 * Initialize an element array buffer with the given information.
 *
 * @param gl GL context
 * @param information Array of numeric values representing element information
 * @returns
 */
function initElementArrayBuffer(gl: WebGLRenderingContext, information: number[]): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (buffer === null) {
        return null;
    }

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);

    // Now pass the list of information into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(information), gl.STATIC_DRAW);

    return buffer;
}

function createCubePositionBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];
    return initArrayBuffer(gl, positions);
}


function createCubeColorBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
      ];

    // Convert the array of colors into a table for all the vertices.

    let colors: number[] = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
      }

    return initArrayBuffer(gl, colors);
}

function createCubeIndicesBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
      ];
    return initElementArrayBuffer(gl, indices);
}

export function createCubePrimitiveBuffers(gl: WebGLRenderingContext): PrimitiveBuffers | null {
    const position = createCubePositionBuffer(gl);
    const color = createCubeColorBuffer(gl);
    const indices = createCubeIndicesBuffer(gl);

    if (position === null || color === null || indices === null) {
        return null;
    }

    return {
        position,
        color,
        indices,
    }
}
