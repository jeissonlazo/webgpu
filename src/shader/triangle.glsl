const vSrc = `
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
 
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
 
varying vec2 v_texCoord;
varying vec3 v_normal;
 
void main() {
  gl_Position = u_worldViewProjection * a_position;
  v_texCoord = a_texcoord;
  v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
}
`;
 
const fSrc = `
precision highp float;
 
varying vec2 v_texCoord;
varying vec3 v_normal;
 
uniform sampler2D u_diffuse;
uniform vec3 u_lightDirection;
 
void main() {
  vec4 diffuseColor = texture2D(u_diffuse, v_texCoord);
  vec3 a_normal = normalize(v_normal);
  float l = dot(a_normal, u_lightDirection) * 0.5 + 0.5;
  gl_FragColor = vec4(diffuseColor.rgb * l, diffuseColor.a);
}
`;