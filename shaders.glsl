//FRAGMENT SHADER
var frag_layout = `#version 300 es
precision highp float;

in vec2 fragCoords;

out vec4 comp;
`;

var frag_body=`

//uniforms
uniform float iTime;
uniform vec2 iMouse;
uniform int pattern;

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

#define MAX_DEGREE 10

int lineCount(int deg){
 int acc = 0;
  while(deg>0){
  acc += deg--;
  }
  return acc;
}

#define MAX_LINE 55 

vec2 deCast(inout float linedists[MAX_LINE], float s, vec2 cats[MAX_DEGREE+1], int deg, vec2 cp){
  int i = deg;
    int lid = 0;
  while (i>=0){
   for( int j=0; j<i; j++){
     linedists[lid]=lineD(cp,cats[j],cats[j+1]);
     lid++;
     cats[j] = mix(cats[j],cats[j+1], s);
  
   } i--;
     //linedists[ lineCount(deg)] = lineD(cp,cats[0], cats[1]);

  }
 return cats[0];

}

vec2[MAX_DEGREE+1] patternA(){
 
  vec2 catps[MAX_DEGREE+1];

  float x = -1.;
  float y = -1.;
  float dx = 2.;
  float dy = 0.5;
  for (int i = 0; i < 5; i++){
     x += dy * mod(1.+float(i),2.);
     y += dy * mod(float(i),2.0);
    catps [i] = vec2(x,y);
  }
  return catps; 

}

void main(void){

  vec2 cats[MAX_DEGREE+1];
  cats[0] = vec2(-1.,-1.);
  cats[1] = vec2(1.,-1.);
  cats[2] = vec2(1.,-0.);
  cats[3] = vec2(-1,0.);
  cats[4] = vec2(-1,1.);
  cats[5] = vec2(1.,1.);

  vec4 col = vec4(0.,0.,0.,1.);
  //col.r = fragCoords.x;
  //col.g = fragCoords.y;

  vec2 uv = fragCoords;
  vec2 pp = euc2pol(uv);
  
  float vol = 1.0;
  float fa1=30. + 10.*sin(iTime/3.);
  float fa2=20. ;

  float fb1=30. + 10.*sin(iTime/5.);
  float fb2=20. ;
   
  float s1x = vol*sin(iTime+fa1*uv.x);
  float s1y = vol*sin(fa2*uv.y);

  float s2x = vol*sin(iTime+fb1*uv.x);
  float s2y = vol*sin(fb2*uv.y*fb2);

  float layer2 = (s1x+s1y+ s2x + s2y);  
  
// Abs Boxing
  float hf = 4.;
  float vf = 2.;
 
  vol = + 0.5;
  float hd = vol*abs(fract(uv.x*hf)-0.5);
  float vd = vol*abs(fract(uv.y*vf)-0.5);
  
  float md = min(hd,vd);
  //col += layer2;
  //col += hd;
  //
  //col += vd;
  //col += md;
  //
  //
  #define DEG 4
  #define fDEG 6.0

  //cats[MAX_DEGREE+1];
  cats[0] = vec2(-1.,-1.);
  cats[1] = vec2(1.,-1.);
  cats[2] = vec2(1.,-0.);
  cats[3] = vec2(-1,0.);
  cats[4] = vec2(-1,1.);
  cats[5] = vec2(1.,1.);

  for (int i=0; i < lineCount(DEG) ; i++){
    cats[i] = vec2(mod(float(i),3.) - 1.,  2.*mod(float(i),2.)-1.);
  }


  vec2 fdims = vec2(8,4)*0.5;
  vec2 fuv = uv*fdims; fuv = 2.*fract(fuv) - 1.0;

  vec2 cuv[9];
  cuv[0] = fuv; cuv[0].x-=2.; cuv[0].y-=2.;
  cuv[1] = fuv; cuv[1].x+=0.; cuv[1].y-=2.;
  cuv[2] = fuv; cuv[2].x+=2.; cuv[2].y-=2.;
  cuv[3] = fuv; cuv[3].x-=2.; cuv[3].y+=0.;
  cuv[4] = fuv; cuv[4].x+=2.; cuv[4].y-=0.;
  cuv[5] = fuv; cuv[5].x-=2.; cuv[5].y+=2.;
  cuv[6] = fuv; cuv[6].x+=0.; cuv[6].y+=2.;
  cuv[7] = fuv; cuv[7].x+=2.; cuv[7].y+=2.;
  cuv[8] = fuv;

  col = vec4(0.,0.,0.,1.);

  #define DDIV DEG
  //TODO: Paramaterise Phases
for (int j = 0 ; j < DEG/DDIV; j++ ){  // Integrate concurrent  phase
for (int i = 0 ; i < 9; i++ ){  //Loop checks neighbours
  float lineds[MAX_LINE];
  vec2 bp =  deCast( lineds , 
    fract(float(iTime)+float(j*DDIV)/fDEG) * length(iMouse-uv),   // The main slider
    cats, 
    DEG, 
    cuv [i]); //bp = bezierPoint

  float bpl = length(bp-fuv);

int lc = lineCount(DEG);
  for (int li = 0; li <  lc; li++){
    col.rgb = max( 
      col.rgb,
    ( 
    (1.-smoothstep(lineds[li],0.,0.01))
      )

    );
      col.rb +=  1./(float(1))*(1.-smoothstep(lineds[li],0.,0.01));

  }

 float pd = bpl;
  
  }
}

	comp = clamp(col,0.,1.);
}`
;
