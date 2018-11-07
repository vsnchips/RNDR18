var frag_buffer_restore = `

void main(void){

  vec2 tuv = fragCoords.xy * 0.5 + vec4(0.5);
 
  vec4 t = texture(u_swapBuffer,tuv);


}`
