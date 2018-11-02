
var frag_distance_functions =`

vec2 vor_ps[128];
int u_neighCount  = 8;

const float FAR = 99999999.f;

struct voro_check{
  vec2 neighbors[8];
} the_voro_check;

float voronoid (in vec2 p){
  float d= FAR;
  for (int i = 0 ; i< u_neighCount; i++ ) {
    d = min(d,length( p - the_voro_check.neighbors[i]));
  }

return d;

}

`;
