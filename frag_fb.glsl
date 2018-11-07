var frag_mix_feedback=`

#define FADE 0.94
#define VOL 01. 

void main(void){

//  comp.a=0.5;

  vec2 uv = fragCoords;
  vec2 tuv = uv/2. + 0.5;

  vec4 swap = texture(u_swap_tex,tuv);
  vec4 webcam = texture(u_webcam_tex,tuv);

  vec3 diff = abs( webcam.rgb - swap.rgb );
 float newdiff = length(diff);


// Fade In the new derivative;
float der = swap.a * FADE + VOL*newdiff;

//comp.rgb = vec3(der);
comp.rgb = webcam.rgb;

comp.a = der;

// per pixel derivative
float dx = 1./u_viewPort.x;
float dy = 1./u_viewPort.y;

/*
float kernel[9] = [
texture(u_webcam_tex,tuv+vec2(-dx,-dy),
texture(u_webcam_tex,tuv+vec2(-dx,-0),
texture(u_webcam_tex,tuv+vec2(-dx,0),
texture(u_webcam_tex,tuv+vec2(-dx,0),
texture(u_webcam_tex,tuv+vec2(-dx,0),
texture(u_webcam_tex,tuv+vec2(-dx,0),
texture(u_webcam_tex,tuv+vec2(-dx,0),
texture(u_webcam_tex,tuv+vec2(-dx,0),
    )
]
*/

}`;
