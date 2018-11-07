var frag_helpers=`
// HELPER FUNCTIONS
vec2 euc2pol(vec2 uv){ 
	  return vec2(atan(uv.x,uv.y), length(uv));
}
vec2 pol2euc(vec2 uv){ 
	  return vec2( uv.y * sin(uv.x), uv.y * cos(uv.x));
}

vec2 basis(vec2 p , vec2 bx, vec2 by){
 vec2 n = p.x * bx + p.y * by;
  return n;
}

vec2 pointRelLine(vec2 p,vec2 a, vec2 b){
  vec2 bx = normalize(b - a);
  vec2 by = vec2(bx.y,-bx.x);
  vec2 bc = basis(p-a,bx,by);

  return bc; 
}

float lineD(vec2 p , vec2 a, vec2 b){
  vec2 cp = pointRelLine(p,a,b);
  float l=length(b-a);
 // return abs(cp.y);
  return length(vec2(max(abs(cp.x-l/2.) - (l/2.), 0.) , cp.y));
}

// 2D Noise function courtest of bookofshaders.com

float random2D (in vec2 st){

  return fract(sin(dot(st.xy,
                vec2(12.9898,78.233))) * 43758.5453123);
}

//Here is the jitter function. It applies a noise function to a tiled grid.
// It has the same results for every fragment.

vec2 jitter( in ivec2 uv, float volume){
  return vec2(uv) - vec2(0.5*volume)
    + (volume * 
      random2D( vec2( uv ))); //Assume that the pseudo noise is unbiased enough
}

// Quantising the uv enforces consistency


// The base case
float nearestEccentric( vec2 p, float n, float volume, int quant ){
  vec2 multHome = vec2(float(quant)) * p;
  ivec2 quantHome =  ivec2( floor (p*float(quant)) );
  float d = FAR;
  // Sample nxn neighborhood
  // It round the dimension up to the nearest odd number
  for (float i=float(quantHome.x)-n/2.f; i < float(quantHome.x)+n/2.f; i++){
    for (float j=float(quantHome.y)-n/2.f; j <float(quantHome.y)+n/2.f; j++){
      ivec2 tryCell = ivec2 (i,j) ;
      
      d = min(d, length(multHome - jitter(tryCell, volume)));
    }
  }
  return d/float(quant);
}



// The displaced case
float nearestEccentric_displaced( vec2 p, float n, float volume, int quant, sampler2D displace ){

  vec2 multHome = vec2(float(quant)) * p;
  ivec2 quantHome =  ivec2( floor (p*float(quant)) );
  float d = FAR;
  
  // Sample nxn neighborhood
  // It round the dimension up to the nearest odd number
  
  for (float i=float(quantHome.x)-n/2.f; i < float(quantHome.x)+n/2.f; i++){
    for (float j=float(quantHome.y)-n/2.f; j <float(quantHome.y)+n/2.f; j++){
      ivec2 tryCell = ivec2 (i,j) ;
      vec2 jitPoint = jitter(tryCell, volume);

    float samp_Alpha = 0.5+15.0*texture(displace, jitPoint/float(quant)).a;
  
    d = min(d, samp_Alpha*length(multHome - jitPoint));
    }
  }
  return d/float(quant);
}

// The recursive case
// TODO: Make it iterative
// This zooming version displays two or three levels at a time. It delegates the micro level
// to the stage 1 finder.
float nearestEccentric_WithZoom_radius( vec2 p, float n, float volume, int quant, float radius ){

  vec2 multHome = vec2(float(quant)) * p;
  ivec2 quantHome =  ivec2( floor (p*float(quant)) );
  float d = FAR;
  
  // Transform the view to the coordinates of the neighborhood
  //vec2 tView = vec2(float(quant)*u_nowView*u_Zoom);
  vec2 tView = vec2(float(quant)*u_nowView*u_Zoom/u_viewPort);

  // Sample nxn neighborhood
 
 // It round the dimension up to the nearest odd number
  for (float i=float(quantHome.x)-n/2.f; i < float(quantHome.x)+n/2.f; i++){
    for (float j=float(quantHome.y)-n/2.f; j <float(quantHome.y)+n/2.f; j++){

      ivec2 tryCell = ivec2 (i,j) ;
      vec2 jitPoint =  jitter(tryCell, volume);

      float uv_Length = length(multHome - jitPoint);
      float focus_Length = length(tView - jitPoint);

  if (focus_Length/float(quant) < u_Zoom*radius){ //Split this node it its close to the focus

        d = min(d-0.0f, 0.+ LEVEL_RATIO_QUANT*float(quant) *
                        nearestEccentric(p,n,volume, 
                          int(float(quant)*LEVEL_RATIO_QUANT))
                        /
                        focus_Length
                        );  
      } else

     d = min( d, uv_Length);
    }
  }
  return d/float(quant);
}
`;
