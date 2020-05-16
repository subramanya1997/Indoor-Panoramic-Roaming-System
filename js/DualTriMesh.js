// Pair is used to store points with the same name
var Pair = function(options) {
    var options = options || {};
    var x1, y1, u1, v1;
    var x2, y2, u2, v2;
    if (options.loading === true) {
        // If loading from pairs.json, set x1, y1, x2, y2 and set u1, v1, u2, v2 according to them
        x1 = options.x1;
        x2 = options.x2;
        y1 = options.y1;
        y2 = options.y2;
        u1 = x1/2048 + 0.5;
        v1 = (-y1/1024) + 0.5;
        u2 = x2/2048 + 0.5;
        v2 = (-y2/1024) + 0.5;
    } else if (options.x1 !== undefined) {
        x1 = options.x1;
        y1 = options.y1;
        u1 = options.u1;
        v1 = options.v1;
        x2 = x1;
        y2 = y1;
        u2 = u1;
        v2 = v1;
    } else if (options.x2 !== undefined) {
        x2 = options.x2;
        y2 = options.y2;
        u2 = options.u2;
        v2 = options.v2;
        x1 = x2;
        y1 = y2;
        u1 = u2;
        v1 = v2;
    } else {
        return { valid: false };
    }
    var ret = {
        x1: x1, y1: y1,
        x2: x2, y2: y2,
        u1: u1, v1: v1,
        u2: u2, v2: v2,
        valid: true,
        isPair: true
    };
    return ret;
};

// TriMesh is a triangle on the sphere, n is #sep, radius is the size of the ball, the last parameter can be ignored
// Actually this part is a bit complicated ... so take a look ...
// [Please take a look at bary.png for coordinates]
var TriMesh = function(n, radius, useVertexNormals) {
    var _this = this;
    this.n = n;
    this.radius = radius;
    this.group = new THREE.Group();
    this.useVertexNormals = useVertexNormals || false;

    // The coordinates of (i, j) in bary.png, index from top to bottom, left to right (starting at 0)
    this.index = function(i,j) {
        return parseInt(i*(i+1)/2+j);
    };
    // (i, j) center of gravity coordinates
    this.bary = function(i,j) {
        var n = _this.n;
        return {
            x: (n-1-i)/(n-1),
            y: (i-j)/(n-1),
            z: j/(n-1)
        };
    };
	// For each (i, j), call the callback function
    this.traverse = function(cb) {
        var n = _this.n;
        var cb = cb || function(){};
        for (var i = 0; i <= n-1; ++i) {
            for (var j = 0; j <= i; ++j) {
                cb(i,j);
            }
        }
    };
    // Three vertices of TriMesh (triangle), three uv coordinates
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.c = new THREE.Vector3();
    this.uv1 = new THREE.Vector2();
    this.uv2 = new THREE.Vector2();
    this.uv3 = new THREE.Vector2();

    // Spherical interpolation, SLERP
    function lerpDirection(v1,v2,t) {
        var angle = v1.angleTo(v2);
        var axis = new THREE.Vector3().crossVectors(v1, v2).normalize();
        return v1.clone().applyAxisAngle(axis, angle*t).normalize();
    }

    // 3D coordinates of (i, j)
    this.position = function(i,j, useAxisAngle) {
        var v = new THREE.Vector3();
        if (useAxisAngle === true) {
            // use lerp
            var vl = lerpDirection(_this.a.clone().normalize(), _this.b.clone().normalize(), i/(_this.n-1));
            var vr = lerpDirection(_this.a.clone().normalize(), _this.c.clone().normalize(), i/(_this.n-1));
            return lerpDirection(vl, vr, j/i);
        } else {
            // Now use this, first obtain the coordinates of the center of gravity from (i, j), and then obtain the three-dimensional 
			// coordinates from the coordinates of the center of gravity and the three vertices
            var b = _this.bary(i,j);
            v.x = b.x*_this.a.x + b.y*_this.b.x + b.z*_this.c.x;
            v.y = b.x*_this.a.y + b.y*_this.b.y + b.z*_this.c.y;
            v.z = b.x*_this.a.z + b.y*_this.b.z + b.z*_this.c.z;
            return v;
        }
    };
    // Get the texture coordinates of (i, j)
    this.uv = function(i,j) {
        var b = _this.bary(i,j);
        var v = new THREE.Vector2();
        v.x = b.x*_this.uv1.x + b.y*_this.uv2.x + b.z*_this.uv3.x;
        v.y = b.x*_this.uv1.y + b.y*_this.uv2.y + b.z*_this.uv3.y;
        return v;
    };
    // Update three vertices with a, b, c
    this.update = function(a,b,c, useAxisAngle) {
        var n = _this.n;
        // Update vertex
        _this.a.copy(a.clone().normalize());
        _this.b.copy(b.clone().normalize());
        _this.c.copy(c.clone().normalize());
        // Update the internal (top of each triangle) point (the interior is subdivided!)
        if (_this.group.children.length > 0) {
            var mesh = _this.group.children[0];
            _this.traverse(function(i,j){
                var index = _this.index(i,j);
                mesh.geometry.vertices[index].copy(_this.position(i,j,useAxisAngle).setLength(_this.radius));
                if (_this.useVertexNormals) {
                    mesh.geometry.vertexNormals[index].copy(mesh.geometry.vertices[index].clone().negate().normalize());
                }
            });
            mesh.geometry.verticesNeedUpdate = true;
            if (_this.useVertexNormals) {
                mesh.geometry.normalsNeedUpdate = true;
            }
        }
    };
    // Initialization, a, b, c are vertices, uv1, uv2, uv3 are corresponding texture coordinates, 
	// n is #sep, radius is spherical radius, useAxisAngle is temporarily not used
    this.init = function(a,b,c, uv1, uv2, uv3, material, n, radius, useAxisAngle) {
        _this.a.copy(a);
        _this.b.copy(b);
        _this.c.copy(c);
        _this.uv1.copy(uv1);
        _this.uv2.copy(uv2);
        _this.uv3.copy(uv3);
        _this.material = material;
        _this.n = n;
        _this.radius = radius;

        _this.group.children = [];
        var geometry = new THREE.Geometry();
        if (_this.useVertexNormals) {
            geometry.vertexNormals = [];
        }
        _this.traverse(function(i,j){
            var v = _this.position(i,j, useAxisAngle);
            geometry.vertices.push(v.setLength(_this.radius));
            if (_this.useVertexNormals) {
                geometry.vertexNormals.push(v.clone().negate().normalize());
            }
        });
        geometry.verticesNeedUpdate = true;
        if (_this.useVertexNormals) {
            geometry.normalsNeedUpdate = true;
        }
        geometry.faceVertexUvs[0] = [];
        // There are many faces inside, one by one structure (I will not comment more on the schematic here)
        for (var i = 1; i <= n-1; ++i) {
            for (var j = 0; j < i; ++j) {
                //             A(i-1,j)
                //
                //               /\
                //              /__\
                //
                //         B(i,j)   C(i,j+1)
                var ix = _this.index(i-1,j);
                var iy = _this.index(i,j);
                var iz = _this.index(i,j+1);
                geometry.faces.push( new THREE.Face3(ix,iy,iz) );
                geometry.faceVertexUvs[0].push([
                    _this.uv(i-1,j),
                    _this.uv(i,j),
                    _this.uv(i,j+1)
                ]);
            }
        }
        for (var i = 1; i <= n-2; ++i) {
            for (var j = 0; j < i; ++j) {
                //        B(i,j)   A(i,j+1)
                //              ____
                //              \  /
                //               \/
                //
                //           C(i+1,j+1)
                var ix = _this.index(i,j+1);
                var iy = _this.index(i,j);
                var iz = _this.index(i+1,j+1);
                geometry.faces.push( new THREE.Face3(ix,iy,iz) );
                geometry.faceVertexUvs[0].push([
                    _this.uv(i,j+1),
                    _this.uv(i,j),
                    _this.uv(i+1,j+1)
                ]);
            }
        }

        var mesh = new THREE.Mesh(geometry,material);
        _this.mesh = mesh;
        _this.group.add(mesh);
    };
};

// DualTriMesh is based on TriMesh, which is two overlapping TriMesh,
// Mix the color of the two textures by changing the opacity of the top TriMesh
var DualTriMesh = function(n, radius, useVertexNormals) {
    var _this = this;
    // The default sep is 5 copies
    if (n === undefined) {
        _this.n = 5;
    } else {
        _this.n = n;
    }
    if (radius === undefined) {
        _this.radius = 500;
    } else {
        _this.radius = radius;
    }
    if (useVertexNormals === undefined) {
        _this.useVertexNormals = false;
    } else {
        _this.useVertexNormals = useVertexNormals;
    }
    this.group = new THREE.Group();
    this.group.dualTriMesh = _this;

    // Two TriMesh
    this.triMesh1 = new TriMesh(_this.n, _this.radius*1.0, _this.useVertexNormals);
    this.triMesh2 = new TriMesh(_this.n, _this.radius*1.2, _this.useVertexNormals);
    this.group.add(_this.triMesh1.group);
    this.group.add(_this.triMesh2.group);
    // When updating, just call the respective updates. When updating DualTriMesh, you need to pass in new a, b, c coordinates
    // As for the texture transparency alpha, this is adjusted overall, not one by one
    this.update = function(a,b,c,useAxisAngle) {
        _this.triMesh1.update(a,b,c,useAxisAngle);
        _this.triMesh2.update(a,b,c,useAxisAngle);
    };
    // init mainly initializes two TriMesh
    this.init = function(a,b,c, config1, config2, n, radius, useAxisAngle) {
        if (n !== undefined) { _this.n = n; }
        if (radius !== undefined) { _this.radius = radius; }
        _this.triMesh1.init(
            a, b, c,
            config1.uv1, config1.uv2, config1.uv3, config1.material,
            _this.n, _this.radius*1.0, useAxisAngle
        );
        _this.triMesh2.init(
            a, b, c,
            config2.uv1, config2.uv2, config2.uv3, config2.material,
            _this.n, _this.radius*1.2, useAxisAngle
        );
    };
};
