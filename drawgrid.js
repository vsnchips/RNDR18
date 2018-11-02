//Globals
var gc;
var the_canvas;
var appgl = {}; //struct for app's graphics stuff
var sp; //the shader program

let anchors = [];
const frameMax = 60;

var speedslider;
var patternselect;
var viewQuad;

var mx=0,my=0;

function glObject(){
  var vPosAttribPtr;
  var vertBuffer;
}


function gl_boilerplate_init(){

 // debugger;

var fragSrc = frag_layout + frag_body; 
  vertshader = gc.createShader(gc.VERTEX_SHADER);
  fragshader = gc.createShader(gc.FRAGMENT_SHADER);
 gc.shaderSource(vertshader,vertSrc);
 gc.shaderSource(fragshader,fragSrc);
 
 gc.compileShader(vertshader);
 console.log(`vert shader:${gc.getShaderInfoLog(vertshader)}`);
 gc.compileShader(fragshader);
 console.log(`fragment shader:${gc.getShaderInfoLog(fragshader)}`);

 sp = gc.createProgram();
 gc.attachShader(sp,fragshader);
 gc.attachShader(sp,vertshader);
 gc.linkProgram(sp);
 gc.useProgram(sp);

 appgl.prog = sp;


 viewQuad = new glObject();
	
 viewQuad.vertBuffer = gc.createBuffer();
 gc.bindBuffer(gc.ARRAY_BUFFER, viewQuad.vertBuffer);
 vertices = [
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0,
       1.0, 1.0,  0.0,
      -1.0, 1.0,  0.0
  ];
  gc.bufferData(gc.ARRAY_BUFFER, new Float32Array(vertices), gc.STATIC_DRAW);
  var vertAttribPtr;

  gc.vertexAttribPointer(viewQuad.vPosAttribPtr, 3, gc.FLOAT, false, 0,0);
  gc.enableVertexAttribArray(viewQuad.vPosAttribPtr);
  viewQuad.vertBuffer.itemSize = 3;

  viewQuad.vertBuffer.numItems = 4;

  let loopLength = frameMax;

}


/*
 * This is the function to implement to make your own abstract design.
 *
 * arguments:
 * p5: the p5.js object - all draw commands should be prefixed with this object
 * x1, x2, y1, y2: draw the pattern contained in the rectangle x1,y1 to x2, y2
 * z: use this as the noise z offset (can be shifted)
 * zoom: current zoom level (starts at 0), useful to decide how much detail to draw
 *
 * The destination drawing should be in the square 0, 0, 255, 255.
 */



/* the random number seed for the tour */
var tourSeed = 301;
/* triplets of locations: zoom, x, y */
var tourPath = [
  [2, 512, 512],
  [4, 512, 512],
  [6, 512, 512]
]

// This version draws two rectangles and two ellipses.
// The rectangles are 960x720 and centered at 512,512.
function drawGrid(p5, x1, x2, y1, y2, z, zoom) {
  // debug - show border
  // p5.noFill();
   p5.stroke(255, 0, 0)
   p5.rect(0, 0, 255, 255);

  //console.log ("mx" + mx);
//  if (mouseIsPressed) {
//    fill(0);
//  }
//  else {
//   fill(255);
//  }

  // updates
  var iTime = p5.millis()/60 * (1/2000);
  gc.uniform1f(gc.getUniformLocation(appgl.prog,"iTime"),iTime*5);

  gc.uniform2f(gc.getUniformLocation(appgl.prog,"iMouse"), mx,my);
  
  gc.clearColor(0,0.5,0,1);
  gc.clear(gc.COLOR_BUFFER_BIT);
  gc.enableVertexAttribArray(viewQuad.vPosAttribPtr);
  gc.drawArrays(gc.TRIANGLE_FAN,0,4);
  gc.disableVertexAttribArray(viewQuad.vPosAttribPtr);
 

}
