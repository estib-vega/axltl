struct Uniforms {
  modelViewProjectionMatrix : mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(1) @binding(0) var<uniform> model : mat4x4<f32>;

struct VertexOut {
  @builtin(position) position : vec4<f32>,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position : vec4<f32>,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position =  uniforms.modelViewProjectionMatrix * model * position;
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}