/*
 *
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
];

// This version draws two rectangles and two ellipses.
// The rectangles are 960x720 and centered at 512,512.
function drawGrid(p5, x1, x2, y1, y2, z, zoom) {
  // debug - show border
}

function do_a_frame(){

  //temp

  camElm.style.visibility="hidden";

  update();
  update_the_webcam_texture();

  //////// Buffer Juggling /////////////
  
  // Restore Pass
    // Copy swap to state frame
  gc.bindFramebuffer(gc.FRAMEBUFFER, gl_swapSheet.frameBuff);
//Uniforms
  uniforms_toprogram(appgl.buffprog);
  draw_restore_buffer();

  // State Processing Pass
  // Render new state to swap frame
  gc.bindFramebuffer(gc.FRAMEBUFFER, gl_stateSheet.frameBuff); 
//Uniforms
  uniforms_toprogram(appgl.fbprog);
  draw_the_state();

  // Bind the canvas
 gc.bindFramebuffer(gc.FRAMEBUFFER,null);

  //Mode switch between programs
  if (MODE==0){
  gc.activeTexture(gc.TEXTURE1);
  gc.bindTexture(gc.TEXTURE_2D,gl_stateSheet.texture);
  gc.activeTexture(gc.TEXTURE2);
  gc.bindTexture(gc.TEXTURE_2D,gl_swapSheet.texture);
    draw_the_backdrop();

  }
  if (MODE==1){
  gc.activeTexture(gc.TEXTURE1);
  gc.bindTexture(gc.TEXTURE_2D,gl_stateSheet.texture);
  gc.activeTexture(gc.TEXTURE2);
  gc.bindTexture(gc.TEXTURE_2D,gl_swapSheet.texture);
    draw_the_state();
  }
  if (MODE==2){
  gc.activeTexture(gc.TEXTURE1);
  gc.bindTexture(gc.TEXTURE_2D,gl_stateSheet.texture);
  gc.activeTexture(gc.TEXTURE2);
  gc.bindTexture(gc.TEXTURE_2D,gl_swapSheet.texture);
    draw_restore_buffer();  
  }

  //Branding layer
  draw_the_branding();
  // Next Frame
  requestAnimationFrame(do_a_frame);
}

function update(){
  // updates
  frame++;
  iTime = frame/30 * (1/20);
  const EASE = 0.3;
  u_nowView.x = u_nowView.x + (view.x - u_nowView.x) * EASE;
  u_nowView.y = u_nowView.y + (view.y - u_nowView.y) * EASE;
  u_Zoom = 1;

}

function update_the_webcam_texture(){

  gc.activeTexture(gc.TEXTURE0);
  gc.bindTexture(gc.TEXTURE_2D, gl_webcam_tex);
  gc.texImage2D(gc.TEXTURE_2D,0,gc.RGBA,gc.RGBA,
    gc.UNSIGNED_BYTE,
    camElm ); 

  gc.texParameteri(gc.TEXTURE_2D, gc.TEXTURE_WRAP_S, gc.CLAMP_TO_EDGE);
  gc.texParameteri(gc.TEXTURE_2D, gc.TEXTURE_WRAP_T, gc.CLAMP_TO_EDGE);
  gc.texParameteri(gc.TEXTURE_2D, gc.TEXTURE_MIN_FILTER, gc.LINEAR);
}

function uniforms_toprogram( toprog ){
  gc.uniform2f(gc.getUniformLocation(toprog,"iMouse"), mx,my);
  gc.uniform1f(gc.getUniformLocation(toprog,"iTime"),iTime);
  gc.uniform1f(gc.getUniformLocation(toprog,"u_Zoom"),u_Zoom);
  gc.uniform2f(gc.getUniformLocation(toprog,"u_nowView"),u_nowView.x, u_nowView.y);
  //gc.uniform2f(gc.getUniformLocation(toprog,"u_viewPort"),viewSize.width,viewSize.height);
  gc.uniform2f(gc.getUniformLocation(toprog,"u_viewPort"),1920,1080);
  gc.uniform1fv(gc.getUniformLocation(toprog,"u_voro_ps"),u_vor_ps);

  //Texture Locations
  gc.uniform1i(gc.getUniformLocation(toprog,"u_webcam_tex"),0 );
  gc.uniform1i(gc.getUniformLocation(toprog,"u_state_tex"), 1 );
  gc.uniform1i(gc.getUniformLocation(toprog,"u_swap_tex"), 2 );
}
  
function draw_quad(){
  gc.enableVertexAttribArray(viewQuad.vPosAttribPtr);
  gc.drawArrays(gc.TRIANGLE_FAN,0,4);
  gc.disableVertexAttribArray(viewQuad.vPosAttribPtr);
}

function draw_restore_buffer(){
  gc.useProgram(appgl.buffprog);
  uniforms_toprogram( appgl.buffprog );
  gc.colorMask(true,true,true,true);
  gc.clearColor(0,0.0,0,0);
  gc.clear(gc.COLOR_BUFFER_BIT);
  draw_quad();
}

function draw_the_state(){
  // console.log("drawing the state");
  
  gc.useProgram(appgl.fbprog);
  uniforms_toprogram( appgl.fbprog );
  gc.colorMask(true,true,true,true);
  gc.clearColor(0,0.0,0,0);
  gc.clear(gc.COLOR_BUFFER_BIT);
  draw_quad();

}

function draw_the_backdrop(){
  gc.useProgram(appgl.prog);
  //gc.useProgram(appgl.grabprog);
  uniforms_toprogram( appgl.grabprog );
  uniforms_toprogram( appgl.prog );
  gc.colorMask(true,true,true,true);
  gc.clearColor(0,0.0,0,0);
  gc.clear(gc.COLOR_BUFFER_BIT);
  draw_quad();
}

function draw_the_branding(){
  logo_ctx.clearRect(0,0,1920,1080);
  logo_ctx.drawImage(logo_vec,0,0); 
}
