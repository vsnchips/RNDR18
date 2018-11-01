var  frag_helpers=`
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
`;
