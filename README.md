## RNDR18 Interactive Signage 

Demo Video:

[![](https://img.youtube.com/vi/2Eyh6O1Xiyo/hqdefault.jpg)](https://youtu.be/2Eyh6O1Xiyo)

Live Example:

https://bl.ocks.org/vsnchips/56939272a02f941fe75c67d060af36b7/e77ceb9a34128dd97b9432900e2970095ddc5f83

The production crew for the end of year exhibition requested my help in designing a welcome sign for the show.
The brief was to present the exhibition's logo on an animated background that would react to user input.\
      I decided the procedural map project http://www.purview.nz/versions/56939272a02f941fe75c67d060af36b7.html would be a good basis pattern to work with, so I removed the map navigation code, added a video element, and wrote a new drawing loop with multiple render targets.

A "process" shader implements simple motion detection by comparing the current video frame to the last framed
saved in the swap buffer.
It combines this value with a convolution kernel which propagates the motion value across the frame, with a multiplicative attenuation.
The result is stored through the alpha channel.

The resulting alpha channel is then used by the voronoi renderer as a sort of displacement map. It samples it as weights with which to
multiply the distance value of each jittered point.

## Interaction

To develop the effect, I had to visualise the state of each buffer.
Middle mouse click switches which shader program binds to the screen, so you can see the propagation effect
happening over the alpha channel of the feedback buffer. (One of these buffers is a dummy buffer for swap purposes.)
