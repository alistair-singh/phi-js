
var convexHull = (pos, scale, center, segments) => {
  var $this = {
    _pos: pos || createVector(0, 0),
    _scale: scale || 1,
    _center: center||createVector(0,0),
    _segments: segments ||
      [
        createVector(0, 0),
        createVector(-1, -1),
        createVector(1, -1),
      ]
  };
  return {
    position: () => $this._pos,
    triangles: (observer) => {
      for (let i0 = 0; i0 < $this._segments.length - 2; i0++) {
        let i1 = i0 + 1;
        let i2 = i0 + 2;  
        let x0 = $this._segments[i0].x * $this._scale + $this._pos.x;
        let y0 = $this._segments[i0].y * $this._scale + $this._pos.y;
        let x1 = $this._segments[i1].x * $this._scale + $this._pos.x;
        let y1 = $this._segments[i1].y * $this._scale + $this._pos.y;
        let x2 = $this._segments[i2].x * $this._scale + $this._pos.x;
        let y2 = $this._segments[i2].y * $this._scale + $this._pos.y;
        console.log([x0, y0, x1, y1, x2, y2]);
        observer(x0, y0, x1, y1, x2, y2);
      }
    }
  };
};

var hull;

function setup() {
  hull = convexHull(createVector(50, 50), 50);
}

var drawn = false;
function draw() {
  if (!drawn) {
    hull.triangles(triangle);
    drawn = true;
  }
}
