struct Fragment {
  @location(0) Color : vec4<f32>
};

@fragment
fn main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {
  var colors  = array<vec3<f32>,3>(
    vec3<f32>(1.0, 0.0, 0.0),
    vec3<f32>(0.0, 1.0, 0.0),
    vec3<f32>(0.0, 0.0, 1.0)
  );

  return vec4<f32>(colors[0], 1.0);
}
