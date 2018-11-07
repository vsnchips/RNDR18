//FRAGMENT SHADER
var frag_layout = `#version 300 es
precision highp float;
in vec2 fragCoords;
out vec4 comp;


//CONSTANTS AND DEFINES
const float FAR = 99999999.f;
const float VOLUME = 1.f;
const float NEIGH_SIZE = 5.f * VOLUME;
// CELLS PER UNIT UV
const int QUANT = 2; 

//rNESTING SETTINGS
const float LEVEL_RATIO_VOL = 1.f/2.7f;
const float LEVEL_RATIO_QUANT = 2.7f;

const float FOCUS_RADIUS = 0.5;

//uniforms
uniform float iTime;
uniform vec2 iMouse;
uniform int pattern;
uniform float u_Zoom;
uniform vec2 u_nowView;
uniform vec2 u_viewPort;

uniform sampler2D u_webcam_tex;
uniform sampler2D u_state_tex;
uniform sampler2D u_swap_tex;

`;

var frag_output_main =`

void main(void){

  //Get the samples
  vec2 tuv = fragCoords/2. + 0.5;
  vec4 state = texture(u_state_tex,tuv);
  vec4 swap = texture(u_swap_tex,tuv);
  vec4 webcam = texture(u_webcam_tex,tuv);

  /*
  vec3 col = vec3(0.);
  vec2 uv = fragCoords;
  //vec2 pp = euc2pol(uv);

  float tileVoro = nearestEccentric(uv, NEIGH_SIZE,VOLUME, QUANT);

  col.b += float(QUANT)*tileVoro;
  col.r = log(1.f/(1.f-min(col.b,1.0f)));
  col.br = col.rb;
  col.rgb += vec3(0.);
  col = clamp(col,0.,1.);
  comp.rgb = col;
  tuv = 1.-(uv*0.5 + vec2(0.5));
  vec3 base = vec3(0.36,0.30,0.50);
  base *= tileVoro;
*/
  // Get the derivative state
 // comp.r = swap.a;
 // comp.b = state.a;

  comp = state;
  comp = swap;

//BASE COLOR
    vec3 base =vec3(0.35,0.32,0.4);

    comp.rgb = 1.-vec3(swap.a) + state.rgb*0.0001 + webcam.rgb*0.0001;

//VORONOI

#define VOR_N 6.
  float vor = nearestEccentric_displaced(tuv,VOR_N, 1.0, 20 , u_state_tex);

  comp.rgb = 80.* vor*base + 0.2*comp.rgb;

 // comp.rgb += 0.1*webcam.rgb;

  comp.a = 1.0;

 // comp.a = state.a;
//comp.a=0.8;

}`;
