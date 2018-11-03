
var frag_distance_functions =`

#define VP_COUNT 64 
uniform float u_voro_ps[VP_COUNT];
vec2 vor_ps[128];

#define NEIGHCOUNT 8


struct voro_check{
  vec2 neighbors[NEIGHCOUNT];
} the_voro_check;

float voronoid (vec2 p){
  float d = FAR;
  for (int i = 0 ; i< NEIGHCOUNT; i++ ) {
    //d = min(d, 3. * length( p - u_voro_ps[i].xy));
    //d = min(d,  length( p - vec2(u_voro_ps[4], u_voro_ps[5])));
    d = min(d,  length( p - vec2(u_voro_ps[i*2], u_voro_ps[i*2+1])));
//    d = min( d, 3. * length( p - the_voro_check.neighbors[5]));
  }
return d;
}
`;
