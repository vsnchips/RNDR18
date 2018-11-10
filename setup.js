//Globals
//Debugging/
var MODE=0;

//Sources
  var fragOutSrc; 
  var fragFBSrc; 
  var frag_buffer_restore; 

//GL stuff

var gl_swapBuff;
var gl_stateBuff;
var gl_swapBuff_tex;
var gl_stateBuff_tex;

var buffer_count=1;

const ZOOM = 2.7
var gc;
var appgl = {}; //struct for app's graphics stuff
let anchors = [];
const frameMax = 60;
var speedslider;
var patternselect;
var viewQuad;
var mx=0,my=0;
var viewSize = { width : 1920, height:1080};
var gl_canvas = { width : 1920, height: 1080};

//shader uniforms
var u_nowView = {x:0, y:0};
var u_Zoom=1;
var u_vor_ps = new Float32Array();

// Vector Stuff
var logo_canvas = { width : 1920, height: 1080

};
//var logo_canvas = { width : window.innerWidth, height: window.innerHeight};
var logo_ctx;
var logo_vec = new Image();
logo_vec.onLoad = function() {
  logo_ctx.drawImage(logo_vec,0,0);
}

//logo_vec.src = "Rndr18.svg";
logo_vec.src = "Rndr18-solid.svg";

//animation stuff
var frame=0;
var iTime;

//Webcam stuff

var gl_webcam_tex;

//Interactions
var mousedown = false;
var dragStart;

var view = {x:0, y:0};
var view_last = {x:0, y:0};

function init_voronoi_array(){
  u_vor_ps=[];
  for (var i = 0; i < 64; i++ ){
    const voroRange = 2;
    const half_voro = voroRange/2;
    var newVec = [ 0.2 * i + Math.random() * voroRange - half_voro ];
    u_vor_ps.push(newVec);
  }
}

function mouseMove( e ) {
  if (mousedown){
    view = { 
      //x: view_last.x - (e.pageX - dragStart.pageX ) * Math.pow(ZOOM,-worldMap._zoom),
      x: view_last.x - (e.pageX - dragStart.pageX  ),
      //y: view_last.y + (e.pageY - dragStart.pageY ) * Math.pow(ZOOM,-worldMap._zoom)
      y: view_last.y + (e.pageY - dragStart.pageY ) 
    }
    console.log(view);
  }
}

function catchClick( e ){
  console.log("click " + e); 
  mousedown=true;
  dragStart = e;
  view_last = view;

  if ( e.which == 2 ){
    MODE++;
    MODE = MODE%3;
    console.log(`Draw mode ` + MODE);
  }
}

function releaseClick(){
  console.log("unclick"); 
  mousedown = false;
  view_last = view;
}

function setup_logo_canvas( width, height) {
  body = document.getElementsByTagName("body");
  body[0].style.overflow="hidden";
  body[0].style.overflowX="hidden";
  body[0].style.overflowY="hidden";
  body[0].style.margin=0;
  body[0].style.padding=0;

  //Remove old canvases
  if (gl_canvas.parentNode != null) gl_canvas.parentNode.removeChild(gl_canvas); 
  if (logo_canvas.parentNode!= null) logo_canvas.parentNode.removeChild(logo_canvas); 
  gl_canvas = document.createElement("canvas");
  gl_canvas.style.background="green";
  gl_canvas.id="gl_canvas";
  gl_canvas.width=width; gl_canvas.height=height;
  gl_canvas.style.position="fixed";
  body[0].appendChild(gl_canvas);
  gc = gl_canvas.getContext("webgl2" ,{
    preserveDrawingBuffer: true, 
    premultipliedAlpha : false,
    alpha: true
  });
  gl_boilerplate_init ();
  gl_canvas.style.zIndex = -1;
  // Logo Layer
  logo_canvas = document.createElement("canvas");
  logo_canvas.width = width; logo_canvas.height=height;
  body[0].appendChild(logo_canvas);
  logo_ctx = logo_canvas.getContext("2d",{alpha:true});
  logo_canvas.style.zIndex=2;
  // Logo Assets
  // Webcam
  gl_webcam_tex = gc.createTexture();
  // Controls
}

function glObject(){
  var vPosAttribPtr;
  var vertBuffer;
}

function resizeMap(){
  viewSize.width = window.innerWidth; 
  viewSize.height = window.innerHeight;
  setup_logo_canvas(1920,1080);
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}

var vertshader, fragshader;
var frag_helpers;
var frag_tracers;
var frag_intersections;
var frag_distance_functions;
var frag_procedural_map_main;

var squareVertexPositionBuffer;

function makeProg( vertS, fragS, name){

  vertshader = gc.createShader(gc.VERTEX_SHADER);
  fragshader = gc.createShader(gc.FRAGMENT_SHADER);
  gc.shaderSource( vertshader,vertS );
  gc.shaderSource( fragshader,fragS );

  gc.compileShader(vertshader);
  console.log(name +` vert shader:${gc.getShaderInfoLog(vertshader)}`);
  gc.compileShader(fragshader);
  console.log(name + ` fragment shader:${gc.getShaderInfoLog(fragshader)}`);

  var newprog = gc.createProgram();
  gc.attachShader(newprog,fragshader);
  gc.attachShader(newprog,vertshader);
  gc.linkProgram(newprog);

  return newprog;
}

function concatfrag( main ){
  return  frag_layout +
    frag_helpers +
    frag_decast + frag_distance_functions +
    main;
}

  // Shader Compilation
function gl_makeShaders(){
  fragBuffSrc = 
    concatfrag(frag_buffer_restore);

  fragFBSrc = 
    concatfrag(frag_mix_feedback);

  fragGrabAlphaSrc = 
    concatfrag(frag_grab_alpha);

  fragOutSrc = 
    concatfrag(frag_output_main);

  fbProg = makeProg(vertSrc, fragFBSrc, "fb");
  buffProg = makeProg(vertSrc, fragBuffSrc, "buff");
  mainProg = makeProg(vertSrc, fragOutSrc, "main");
  grabProg = makeProg(vertSrc, fragGrabAlphaSrc, "grab");

  appgl.prog = mainProg;
  appgl.fbprog = fbProg;
  appgl.buffprog = buffProg;
  appgl.grabprog = grabProg;
}

  // The Quad
function gl_makeQuad(){
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
}

function createSheet( wid, hei){
  var sheet = {
    frameBuff : gc.createFramebuffer(),
    texture : gc.createTexture(),
    location : buffer_count
  }
  if ( sheet.location == 1 ){
    gc.activeTexture(gc.TEXTURE1);
  }else{ gc.activeTexture(gc.TEXTURE2);
  }
  buffer_count++;
  gc.bindTexture(gc.TEXTURE_2D, sheet.texture);
  gc.texImage2D(gc.TEXTURE_2D, 0, gc.RGBA, wid, hei, 0, gc.RGBA, gc.UNSIGNED_BYTE, null);
  gc.texParameteri(gc.TEXTURE_2D, gc.TEXTURE_WRAP_S, gc.CLAMP_TO_EDGE);
  gc.texParameteri(gc.TEXTURE_2D, gc.TEXTURE_WRAP_T, gc.CLAMP_TO_EDGE);
  gc.texParameteri(gc.TEXTURE_2D, gc.TEXTURE_MIN_FILTER, gc.LINEAR);
  gc.bindFramebuffer(gc.FRAMEBUFFER,sheet.frameBuff);
  gc.framebufferTexture2D(gc.FRAMEBUFFER, gc.COLOR_ATTACHMENT0,gc.TEXTURE_2D, sheet.texture, 0);
  return sheet;
}

function gl_boilerplate_init(){

  gc.enable(gc.BLEND);
  //gc.disable(gc.BLEND);
  //gc.blendFunc(gc.SRC_ALPHA, gc.ONE_MINUS_SRC_ALPHA);

  buffer_count = 1;
  gl_makeShaders();
  gl_makeQuad();

// Sheets
  gl_stateSheet = createSheet(1920,1080);
  gl_swapSheet = createSheet(1920,1080);
  gl_webcam_tex = gc.createTexture();
  gc.bindTexture(gc.TEXTURE_2D,gl_webcam_tex);

  let loopLength = frameMax;
}

