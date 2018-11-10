var frag_buffer_restore=`

void main(void){

  vec2 uv = fragCoords;
  vec2 tuv = uv/2. + 0.5;
  vec4 state = texture(u_state_tex,tuv);

 comp = state;
 //comp.a += 0.1;

}
`
