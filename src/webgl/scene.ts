import * as Util from "../util";
import { PrimitiveBuffers } from "./buffer";
import { ShaderProgramInfo } from "./shader";
import { mat4 } from "gl-matrix";

const DEGREES_PER_SECOND = 100;
const INITIAL_Z_OFFSET = -8.0;
const MIN_Z_OFFSET = -10;
const MAX_Z_OFFSET = -4.5;
const Z_OFFSET_SPEED = 0.05;

interface SceneMatrices {
    projectionMatrix: mat4;
    modelViewMatrix: mat4;
}

export default class SceneManager {
    private static singleInstance: SceneManager | undefined = undefined;

    private zOffset: number;
    private rotationRad: number;
    private initialized: boolean;
    private gl: WebGLRenderingContext | undefined;


    private constructor() {
        this.zOffset = INITIAL_Z_OFFSET;
        this.rotationRad = 0;
        this.initialized = false;
        this.gl = undefined;
    }

    /**
     * Get the single instance of the scene manager.
     */
    static instance(): SceneManager {
        if (this.singleInstance === undefined) {
            this.singleInstance = new SceneManager();
        }
        return this.singleInstance;
    }

    /**
     * Initialize the scene manager.
     *
     * @note Will throw an exeption if already initialized.
     */
    init(gl: WebGLRenderingContext) {
        if (this.initialized) {
            throw new Error("Scene manager already initialized!");
        }
        this.gl = gl;
        this.initialized = true;
    }

    /**
     * Update the Z-axis offset.
     */
    zoom(delta: number) {
        this.zOffset = Util.clamp(this.zOffset + delta * Z_OFFSET_SPEED, MIN_Z_OFFSET, MAX_Z_OFFSET);
    }

    /**
     * Setup the scene using th WebGL context APIs.
     *
     * Clear the previous frame in preparation for the current.
     * @note Will throw an exeption if WebGL rendering context is not yet initialized.
     */
     private setupScene() {
        if (this.gl === undefined) {
            throw new Error("Attempting to setup scene without WebGL rendering context!");
        }
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Set clear color to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);      // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);       // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Create the projection and modle view matrices.
     *
     * @note Will throw an exeption if WebGL rendering context is not yet initialized.
     */
    private createMatrices(deltaTime: number): SceneMatrices {
        if (this.gl === undefined) {
            throw new Error("Attempting to create matrices without WebGL rendering context!");
        }
        const projectionMatrix = Util.createProjectionMatrix(this.gl.canvas.width, this.gl.canvas.height);
        this.rotationRad += Util.toRadians(deltaTime * DEGREES_PER_SECOND);

        const rotation: Util.Rotation = {
            radians: this.rotationRad,
            axis: { x: 0.5, y: -1.0, z: 0 },
        }
        const translation: Util.Translation = {
            vector: { x: 0, y: 0, z: this.zOffset },
        }
        const modelViewMatrix = Util.createModelViewMatrix({ rotation, translation });
        return { projectionMatrix, modelViewMatrix };
    }

    /**
     * Bind the position and color buffers.
     *
     * @note Will throw an exeption if WebGL rendering context is not yet initialized.
     */
    private setupBuffers(programInfo: ShaderProgramInfo, primitiveBuffers: PrimitiveBuffers, matrices: SceneMatrices) {
        if (this.gl === undefined) {
            throw new Error("Attempting to setup buffers without WebGL rendering context!");
        }
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3;  // pull out 2 values per iteration
            const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                      // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, primitiveBuffers.position);
            this.gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, primitiveBuffers.color);
            this.gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, primitiveBuffers.indices);

        // Tell WebGL to use our program when drawing
        this.gl.useProgram(programInfo.program);

        // Set the shader uniforms
        this.gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            matrices.projectionMatrix);
        this. gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            matrices.modelViewMatrix);
    }

    /**
     * Draw the configured elements in the setup scene.
     *
     * @note Will throw an exeption if WebGL rendering context is not yet initialized.
     */
    private drawElements() {
        if (this.gl === undefined) {
            throw new Error("Attempting to setup buffers without WebGL rendering context!");
        }
        const vertexCount = 36;
        const type = this.gl.UNSIGNED_SHORT;
        const arrayOffset = 0;
        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, arrayOffset);
    }

    drawScene(deltaTime: number, programInfo: ShaderProgramInfo, primitiveBuffers: PrimitiveBuffers) {
        if (!this.initialized) {
            throw new Error("Attempting to draw scene before initialization!");
        }

        this.setupScene();
        const matrices = this.createMatrices(deltaTime);
        this.setupBuffers(programInfo, primitiveBuffers, matrices);
        this.drawElements();
    }

}