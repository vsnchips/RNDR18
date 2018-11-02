//VERTEX SHADER

var vertSrc = `#version 300 es
in vec3 pos;
out vec2 fragCoords;


void main(void){

  fragCoords = pos.xy;
  gl_Position = vec4(pos,1.0);
}
`;


