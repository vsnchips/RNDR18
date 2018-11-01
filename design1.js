//Globals
var gc;
var the_canvas;
var appgl = {}; //struct for app's graphics stuff

let anchors = [];
const frameMax = 60;
let recording = false;
let gifRecorder = null;
let buffersPerFrame = 1;

var hueslider1, hueslider2, hueslider3;
var brightslider1, brightslider2, brightslider3;
var speedslider;
var patternselect;
var viewQuad;

var mx=0,my=0;

function setup () {
  //  createCanvas(960, 480);
  //  make a webgl canvas
 
  frameRate(30);
  canvas.style.visibility='hidden';
  canvas.remove();

  body = document.getElementsByTagName("body");

  the_canvas = document.createElement("canvas");
  the_canvas.width=960; the_canvas.height=480;
  body[0].appendChild(the_canvas);
  gc = the_canvas.getContext("webgl2" ,{preserveDrawingBuffer: true});
 
  the_canvas.onmousemove = function(ev){
  mx = 2 * ev.clientX / the_canvas.width - 1;
  my = 2 * ev.clientY / the_canvas.height - 1;
    console.log( mx );
    console.log( my );
  // 
} 
  background(128);

  gl_boilerplate_init ();


// Controls
  
  hueslider1 = createSlider(0,100,50);
  hueslider1.parent('Color1_Hue')
  hueslider2 = createSlider(0,100,50);
  hueslider2.parent('Color2_Hue')
  hueslider3 = createSlider(0,100,50);
  hueslider3.parent('Color3_Hue')

  brightslider1 = createSlider(0,100,50);
  brightslider1.parent('Color1_Brightness')
  brightslider2 = createSlider(0,100,50);
  brightslider2.parent('Color2_Brightness')
  brightslider3 = createSlider(0,100,50);
  brightslider3.parent('Color3_Brightness')
  speedslider = createSlider(0,100,50);
  speedslider.parent('Speed');

  patternselect = createSelect();
  patternselect.option('blocky')
  patternselect.option('diagonals')
  patternselect.option('X - diagonals')
  patternselect.parent('Pattern');

  videoCapture = document.createElement('input');
  videoCapture.setAttribute("type","checkbox");
  document.getElementById('gcap').appendChild(videoCapture);
  //videoCapture.parentElement= document.getElementById('gcap');

}

function glObject(){
  var vPosAttribPtr;
  var vertBuffer;
}


function draw () {

  //console.log ("mx" + mx);
  if (mouseIsPressed) {
    fill(0);
  }
  else {
    fill(255);
  }

// updates
 
  var iTime = speedslider.value()*frameCount/30 * (1/2000);
  gc.uniform1f(gc.getUniformLocation(appgl.prog,"iTime"),iTime*5);

  gc.uniform2f(gc.getUniformLocation(appgl.prog,"iMouse"), mx,my);
  
  gc.clearColor(0,0.5,0,1);
  gc.clear(gc.COLOR_BUFFER_BIT);
  gc.enableVertexAttribArray(viewQuad.vPosAttribPtr);
  gc.drawArrays(gc.TRIANGLE_FAN,0,4);
  gc.disableVertexAttribArray(viewQuad.vPosAttribPtr);
 
  if (recording) {
    gifRecorder.addBuffer();
  }


}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
}
}

var vertshader, fragshader;

var  frag_helpers,
     frag_tracers
     frag_intersections,
     frag_distance_functions
     frag_procedural_map_main;
;
var squareVertexPositionBuffer;

fragSrc = frag_layout + frag_body; 
function gl_boilerplate_init(){
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

function mousePressed() {
  if (videoCapture.checked){ 
   console.log("vid!");
  if(recording == false) {
    recording = true;
    gifRecorder = new p5recorder(frameMax, "wallpaper.gif" ,25 , 0, 2);
  }
  }
}
