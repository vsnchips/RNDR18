
var frag_decast = `
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
`;
