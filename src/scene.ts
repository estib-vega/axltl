import { PrimitiveBuffers } from "./buffer";
import { createModelViewMatrix, createProjectionMatrix } from "./matrix";
import { ShaderProgramInfo } from "./shader";

function setupScene(gl: WebGLRenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function drawScene(gl: WebGLRenderingContext, programInfo: ShaderProgramInfo, primitiveBuffers: PrimitiveBuffers) {
    setupScene(gl);

    const projectionMatrix = createProjectionMatrix(gl);
    const modelViewMatrix = createModelViewMatrix();

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 3;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, primitiveBuffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }


    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);


    const arrayOffset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, arrayOffset, vertexCount);
}