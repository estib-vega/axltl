import * as Mat from "./matrix";
import * as Util from "./util";
import { PrimitiveBuffers } from "./buffer";
import { ShaderProgramInfo } from "./shader";

const DEGREES_PER_SECOND = 100;

function setupScene(gl: WebGLRenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

let rotationRad: number = 0;

export function drawScene(
    gl: WebGLRenderingContext,
    programInfo: ShaderProgramInfo,
    primitiveBuffers: PrimitiveBuffers,
    deltaTime: number
) {
    setupScene(gl);

    const projectionMatrix = Mat.createProjectionMatrix(gl);

    rotationRad += Util.toRadians(deltaTime * DEGREES_PER_SECOND);

    const rotation: Mat.Rotation = {
        radians: rotationRad,
        axis: {
            x: 0.5,
            y: -1.0,
            z: 0.3
        }
    }
    const translation: Mat.Translation = {
        vector: {
            x: 0,
            y: 0,
            z: -8.0
        }
    }
    const modelViewMatrix = Mat.createModelViewMatrix({ rotation, translation });

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

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, primitiveBuffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, primitiveBuffers.indices);

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


    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const arrayOffset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, arrayOffset);
}