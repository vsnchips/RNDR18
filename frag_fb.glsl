var frag_mix_feedback=`

//#define FADE 0.999
#define FADE 0.985
#define VOL 10.0 

void main(void){
  
  //COORD ADAPT

  vec2 uv = fragCoords;
  vec2 tuv = uv/2. + 0.5;

 // KERNEL SAMPLES
 
    // per pixel derivative
    float dx = 1./u_viewPort.x;
    float dy = 1./u_viewPort.y;

  vec2 sp0 = tuv+vec2(-dx,-dy);
  vec2 sp1 = tuv+vec2(-0, -dy);
  vec2 sp2 = tuv+vec2( dx,-dy);
  vec2 sp3 = tuv+vec2(-dx, -0);
  vec2 sp4 = tuv+vec2(-0,  -0);
  vec2 sp5 = tuv+vec2( dx, -0);
  vec2 sp6 = tuv+vec2(-dx, dy);
  vec2 sp7 = tuv+vec2(-0,  dy);
  vec2 sp8 = tuv+vec2( dx, dy);

  vec4 swap = texture(u_swap_tex,tuv);
  vec4 webcam = texture(u_webcam_tex,tuv);
  
  vec4 swap0 = texture(u_swap_tex,sp0);
  vec4 swap1 = texture(u_swap_tex,sp1);
  vec4 swap2 = texture(u_swap_tex,sp2);
  vec4 swap3 = texture(u_swap_tex,sp3);
  vec4 swap5 = texture(u_swap_tex,sp4);
  vec4 swap4 = texture(u_swap_tex,sp5);
  vec4 swap6 = texture(u_swap_tex,sp6);
  vec4 swap7 = texture(u_swap_tex,sp7);
  vec4 swap8 = texture(u_swap_tex,sp8);

  vec4 webcam0 = texture(u_webcam_tex,sp0);
  vec4 webcam1 = texture(u_webcam_tex,sp1);
  vec4 webcam2 = texture(u_webcam_tex,sp2);
  vec4 webcam3 = texture(u_webcam_tex,sp3);
  vec4 webcam4 = texture(u_webcam_tex,sp4);
  vec4 webcam5 = texture(u_webcam_tex,sp5);
  vec4 webcam6  = texture(u_webcam_tex,sp6);
  vec4 webcam7 = texture(u_webcam_tex,sp7);
  vec4 webcam8 = texture(u_webcam_tex,sp8);

  float last_neighborhood[9] = float[](
        swap0.a,
        swap1.a,
        swap2.a,
        swap3.a,
        swap4.a,
        swap5.a,
        swap6.a,
        swap7.a,
        swap8.a
        );

    float next_neighborhood[9] = float[](
       length(abs( webcam0.rgb - swap0.rgb )), 
       length(abs( webcam1.rgb - swap1.rgb )), 
       length(abs( webcam2.rgb - swap2.rgb )), 
       length(abs( webcam3.rgb - swap3.rgb )), 
       length(abs( webcam4.rgb - swap4.rgb )), 
       length(abs( webcam5.rgb - swap5.rgb )), 
       length(abs( webcam6.rgb - swap6.rgb )), 
       length(abs( webcam7.rgb - swap7.rgb )), 
       length(abs( webcam8.rgb - swap8.rgb )) 
    );

    float new_input_kernel[9] = float[](
       0.00,0.00,0.23,
       0.23,0.25,0.00,
       0.00,0.23,0.00
    );
/*
    float kernel_corners[9] = float[](
       0.00,0.00,0.23,
       0.23,0.25,0.00,
       0.00,0.23,0.00
    );
*/
/*
    float kernel_corners[9] = float[](
       0.20,0.50,0.23,
       0.53,-3.08,0.50,
       0.20,0.53,0.20
    );
*/
/*
    float kernel_diff[9] = float[](
       -0.20,-0.50, -0.23,
       -0.5,  0.0,  0.50,
        0.23, 0.53, 0.20
    );
*/
/*
    float kernel_max[9] = float[](
       0.20, 0.20, -0.20,
       0.20,  -1.6,  0.20,
        0.20,  0.20,  0.20
    )ncmd;
*/

    float kernel_diff[9] = float[](
       0.20, 0.20, -0.20,
       0.20,  -1.6,  0.20,
        0.20,  0.20,  0.20
    );

  //COMPOSITION

    // Current velocity
    vec3 diff = abs( webcam.rgb - swap.rgb );
    float newdiff = VOL * length(diff);

    //clamp the diff
    newdiff = min(newdiff,2.);

  float der = 0.;
 // der *= 0.2;
  float conv_total = 0.0;
 
    //Mix the convolution
  for (int i = 0 ; i < 9 ; i++){
      conv_total = max( conv_total, FADE * last_neighborhood[i]);
  }

      conv_total = min(conv_total,1.0);

    //conv_total = abs(conv_total);
    der += conv_total;
    der = max( der, newdiff );

    // update rgb with webcam
    comp.rgb = webcam.rgb;

    //Choose an alpha
    comp.a = der;

}`;
