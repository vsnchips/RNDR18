var voronoi =`

vec2 vor_ps[];
int u_neighCount  = 8;

const float FAR = 99999999;

struct voro_check{
  vec2 neighbors [8];
} the_voro_check;

float voronoid (vec2)
  float d= FAR;
  for (int i = 0 ; i< u_neighCunt; i++ ) {
    d = min(d,length( p - the_voro_check.neighbors[i]));
  }

return d;

}

`;
