var frag_grab_alpha = `

void main (void) {

  //Get the samples
  vec2 tuv = fragCoords/2. + 0.5;
  vec4 state = texture(u_state_tex,tuv);
  vec4 swap = texture(u_swap_tex,tuv);
  vec4 webcam = texture(u_webcam_tex,tuv);

  comp.rgb = vec3(state.a);
  comp.rgb = vec3(swap.a);
  comp.a = 0.5;


}

`;
