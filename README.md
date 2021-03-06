 # [Indoor Panoramic Roaming System using three.js](index.html)
The smooth transition among panorama views. By providing control point correspondences, we can guide the view morphing from one panorama to another in a natural way. Compared with typical solutions like blending, stretching, and parallax-effect methods, this solution provides a natural transition effect similar to what people see when walking in 3D environment from one panorama viewing site to another.

The dynamic texture is formed by triangulation, which makes the scene transition of the panoramic roaming system more natural.

![](doc/triangles.png)

| Blend method | Morph method |
|:---:|:---:|
|![](doc/blend-effect-0.25.gif)|![](doc/morph-effect-0.25.gif)|

Stress test & example:

-[Dynamic Panorama](dyna_texture.html)
-[Dynamic Panorama Sphere](dyna_sphere.html)
-Example: [Transition of a triangle](dyna_triangle.html)

## Main interface // Main window

View Demo：
-	Go to the [Sphere] column, click [Open Control], and then [Transition], the effect is not good (see Blend method above);
-	Go to the [Sphere] column, click [Open Control], and finally [Transition], the effect is much better (see Morph method above).

---

Inspiration:

-[Face Morphing using OpenCV (C ++ / Python)-YouTube](https://www.youtube.com/watch?v=pqpS6BN0_7k);
-[Face Morph Using OpenCV — C ++ / Python | Learn OpenCV](http://www.learnopencv.com/face-morph-using-opencv-cpp-python/)

Notes:

-[three.js / examples](https://threejs.org/examples/?q=texture#webgl_raycast_texture);
-[three.js / webgl_raycast_texture.html at master · mrdoob / three.js](https://github.com/mrdoob/three.js/blob/master/examples/webgl_raycast_texture.html);
-[pnitsch / GSVPano.js: Google Street View Panorama Util](https://github.com/pnitsch/GSVPano.js)
-[Canvas Voronoi-bl.ocks.org](https://bl.ocks.org/mbostock/6675193)
-[CodeSeven / toastr: Simple javascript toast notifications](https://github.com/CodeSeven/toastr)
-[d3 / API.md at master · d3 / d3](https://github.com/d3/d3/blob/master/API.md#voronoi-diagrams-d3-voronoi)
-[d3-voronoi / Diagram.js at master · d3 / d3-voronoi](https://github.com/d3/d3-voronoi/blob/master/src/Diagram.js#L82).
-[eligrey / FileSaver.js: An HTML5 saveAs () FileSaver implementation](https://github.com/eligrey/FileSaver.js)

Code reading suggestions: Tutorial.txt
