var frag_mix_feedback=`

void main(void){

  vec2 uv = fragCoords;
  vec2 tuv = uv/2. + 0.5;
  vec4 state = texture(tuv,u_stateBuffer);
}
:
`;
