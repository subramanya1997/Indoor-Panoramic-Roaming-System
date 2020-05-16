 # ![texture-morpher] (index.html)
a tool to make morphable texture

The dynamic texture is formed by triangulation, which makes the scene transition of the panoramic roaming system more natural.

![] (doc/ triangles.png)

| Blend method | Morph method |
|: ---: |: ---: |
| ![](doc/blend-effect-0.25.gif) | ![](doc/morph-effect-0.25.gif) |

Stress test & example:

-[Dynamic Panorama] (dyna_texture.html)
-[Dynamic Panorama Sphere] (dyna_sphere.html)
-Example: [Transition of a triangle] (dyna_triangle.html)

## Main interface // Main window

! [] (doc / chrome_2017-05-05_16-32-17.png)

View Demo：

-   In the [Editor] column, click [Open Control], then [Load Sample Pairs]
-	Go to the [Sphere] column, click [Open Control], and then [Transition], the effect is not good (see Blend method above);
-	Go to the [Editor] column, click [Open Control], and then [Triangle];
-	Go to the [Sphere] column, click [Open Control], and finally [Transition], the effect is much better (see Morph method above).

## EDITOR USE // Usage of Editor

-Right-click on the texture to add points with the same name;
-The newly added point with the same name is activated, and you can move the position through [directional key] (blue point) or [Control + direction key] (green point);
-On the right side, the Pair List can also be used to fine-tune the position;
-You can delete a pair of points with the same name through the [X] button on the Pair List;
-Save the position by the number keys [3] and [4], and then load the position by the number keys [1] and [2], which makes it easier to switch between the two pictures before and after;

## texture 1 & texture 2 // T1 & T2

-Load a new panorama through [Load Picture] under [Open Control];

## Dynamic panorama // Sphere

## Dynamic panorama ball // SPHERE

---

Inspiration:

-[Face Morphing using OpenCV (C ++ / Python)-YouTube] (https://www.youtube.com/watch?v=pqpS6BN0_7k)
-[Face Morph Using OpenCV — C ++ / Python | Learn OpenCV] (http://www.learnopencv.com/face-morph-using-opencv-cpp-python/)

Notes:

-[three.js / examples] (https://threejs.org/examples/?q=texture#webgl_raycast_texture)
-[three.js / webgl_raycast_texture.html at master · mrdoob / three.js] (https://github.com/mrdoob/three.js/blob/master/examples/webgl_raycast_texture.html)
-[pnitsch / GSVPano.js: Google Street View Panorama Util] (https://github.com/pnitsch/GSVPano.js)
-[Canvas Voronoi-bl.ocks.org] (https://bl.ocks.org/mbostock/6675193)
-[CodeSeven / toastr: Simple javascript toast notifications] (https://github.com/CodeSeven/toastr)
-[d3 / API.md at master · d3 / d3] (https://github.com/d3/d3/blob/master/API.md#voronoi-diagrams-d3-voronoi)
-[d3-voronoi / Diagram.js at master · d3 / d3-voronoi] (https://github.com/d3/d3-voronoi/blob/master/src/Diagram.js#L82).
-[eligrey / FileSaver.js: An HTML5 saveAs () FileSaver implementation] (https://github.com/eligrey/FileSaver.js)

Code reading suggestions: Tutorial.txt
