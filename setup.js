//Globals

const ZOOM = 2.7

var gc;
var appgl = {}; //struct for app's graphics stuff
let anchors = [];
const frameMax = 60;
var speedslider;
var patternselect;
var viewQuad;
var mx=0,my=0;
var viewSize = { width : window.innerWidth, height: window.innerHeight};
var gl_canvas = { width : window.innerWidth, height: window.innerHeight};

var mousedown = false;
var dragStart;

var view = {x:0, y:0};
var view_last = {x:0, y:0};

//shader uniforms
var u_nowView = view;
var u_Zoom=1;

var u_vor_ps = new Float32Array();

function init_voronoi_array(){

  u_vor_ps=[];

  for (var i = 0; i < 64; i++ ){
    const voroRange = 2;
    const half_voro = voroRange/2;

    ///var newVec = [ Math.random() * voroRange - half_voro, Math.random() * voroRange - half_voro  ];
    //var newVec = [ 0.2 * i + Math.random() * voroRange - half_voro, Math.random() * voroRange - half_voro , 0,0 ];
    var newVec = [ 0.2 * i + Math.random() * voroRange - half_voro ];
    u_vor_ps.push(newVec);
  }
}


function mouseMove( e ) {
  if (mousedown){
  view = { 
          x: view_last.x - (e.pageX - dragStart.pageX ) * Math.pow(ZOOM,-worldMap._zoom),

          y: view_last.y + (e.pageY - dragStart.pageY ) * Math.pow(ZOOM,-worldMap._zoom)
  }
  console.log(view);
  //u_nowView = view;
  }
}

function catchClick( e ){
  console.log("click " + e); 
  mousedown=true;
  dragStart = e;
  view_last = view;
}

function releaseClick(){
 console.log("unclick"); 
  mousedown=false;
  view_last = view;
}

function setup_gl_canvas( width, height) {

  // Demote the leaflet
  document.getElementsByClassName("leaflet-container" )[0].style.position="absolute";
  body = document.getElementsByTagName("body");
  gl_canvas = document.createElement("canvas");
  gl_canvas.id="gl_canvas";

  gl_canvas.width=width; gl_canvas.height=height;
  //gl_canvas.style.position="fixed";
  gl_canvas.style.position="fixed";

  body[0].appendChild(gl_canvas);
  //gc = gl_canvas.getContext("webgl2" ,{preserveDrawingBuffer: true});
  gc = gl_canvas.getContext("webgl2" ,{preserveDrawingBuffer: true});
 
  gl_boilerplate_init ();

// Controls

}

function glObject(){
  var vPosAttribPtr;
  var vertBuffer;
}

function resizeMap(){
  viewSize.width = window.innerWidth; 
  viewSize.height = window.innerHeight;

  setup_gl_canvas(window.innerWidth, window.innerHeight)
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}

var vertshader, fragshader;

var  frag_helpers;
var  frag_tracers;
var  frag_intersections;
var  frag_distance_functions;
var  frag_procedural_map_main;

var squareVertexPositionBuffer;


function gl_boilerplate_init(){

var fragSrc = 
    frag_layout +
    frag_helpers +
    frag_decast +
    frag_distance_functions +
    frag_body;
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

