navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 if (navigator.getUserMedia) {       
    navigator.getUserMedia({video: true}, handleVideo, donothing);
}
 var camElm = document.getElementById("webcamElement");
function handleVideo(stream) {
    camElm.srcObject = stream;
}
camElm.style.zIndex=-1;
function donothing(e) {
    //
}	
			
/*
var video = document.createElement('vid');
video.width = 1024;
video.height = 768;
video.autoplay = true;
video.src = "http://metacraft.co.nz:81/TheWorks/Permatoast/Docostock/Interactive/KineticProj/MVI_3065.MOV";
*/
