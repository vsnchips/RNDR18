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
      random2D( vec2(uv ))); //Assume that the pseudo noise is unbiased enough
}

// Quantising the uv enforces consistency

float nearestEccentric( vec2 p, float n, float volume ){
  ivec2 quantHome =  ivec2( floor (p) );
  float f = FAR;
  // Sample nxn neighborhood
  // It round the dimension up to the nearest odd number
  float d;
  for (float i=float(quantHome.x)-n/2.f; i < float(quantHome.x)+n/2.f; i++){
    for (float j=float(quantHome.y)-n/2.f; j <float(quantHome.y)+n/2.f; j++){
      ivec2 tryCell = ivec2 (i,j) ;
      d = min(d, length(p - jitter(tryCell, volume)));
    }
  }
  return d;
}


`;
