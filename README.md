## PS4 MDDN 342 2018

## Webcam Installation Variation  

The branding team for the end of year exhibition team requested my help in designing the show.
The brief was to present the exhibition's logo on an animated background that would react to user input.\
      I decided this project would be a good basis pattern to work with, so I removed the map navigation code,
added a video element, and wrote a new drawing loop with multiple render targets.

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

