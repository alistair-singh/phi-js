
var convexHull = (pos, scale, center, rotation, verticies, indicies) => {
  var $this = {
    _pos: pos || createVector(0, 0),
    _scale: scale || 1,
    _rotation: rotation || 0,
    _center: center || createVector(0, 0),
    _verticies: verticies ||
      [
        createVector(-1, -1),
        createVector(1, -1),
        createVector(1, 1),
        createVector(-1, 1)
      ],
    _indicies: indicies || [0, 1, 2, 0, 3, 2]
  };


  var pointX = (i) => $this._verticies[i].x * $this._scale + $this._pos.x;
  var pointY = (i) => $this._verticies[i].y * $this._scale + $this._pos.y;
  return {
    position: () => $this._pos,
    aabb: (tolerance = 0.2) => {
      var minX = pointX(0);
      var maxX = minX;
      var minY = pointY(0);
      var maxY = minY;
      for (let i = 1; i < $this._verticies.length; i++) {
        const x = pointX(i);
        const y = pointY(i);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
      return [
        createVector(minX - tolerance, minY - tolerance),
        createVector(maxX + tolerance, maxY + tolerance)];
    },
    triangles: (observer) => {
      for (let i = 0; i < $this._indicies.length - 2; i += 3) {
        observer(
          pointX($this._indicies[i]),
          pointY($this._indicies[i]),
          pointX($this._indicies[i+1]),
          pointY($this._indicies[i+1]),
          pointX($this._indicies[i+2]),
          pointY($this._indicies[i+2])
        );
      }
    }
  };
};

var hulls;

function setup() {
  createCanvas(480, 480);
  hulls = [convexHull(createVector(100, 100), 50)];
}

var showHull = true;
var showAABB = true;
function draw() {
  background(200);
  hulls.forEach(h => {
    push();
    //h.draw();
    pop();

    push();
    if (showHull) {
      stroke(0, 255, 0);
      h.triangles((x0, y0, x1, y1, x2, y2) => {
        line(x0, y0, x1, y1);
        line(x1, y1, x2, y2);
        line(x2, y2, x0, y0);
      });
    }
    if (showAABB) {
      const aabb = h.aabb(2);
      stroke(255, 0, 0);
      line(aabb[0].x, aabb[0].y, aabb[0].x, aabb[1].y);
      line(aabb[0].x, aabb[0].y, aabb[1].x, aabb[0].y);

      line(aabb[1].x, aabb[0].y, aabb[1].x, aabb[1].y);
      line(aabb[0].x, aabb[1].y, aabb[1].x, aabb[1].y);
    }
    pop();
  });
}
