
var convexHull = (pos, scale, center, rotation, verticies, indicies) => {
  this.pos = pos || createVector(0, 0);
  this.scale = scale || 1;
  this.rotation = rotation || 0;
  this.center = center || createVector(0, 0);
  this.verticies = verticies ||
      [
        createVector(-1, -1),
        createVector(1, -1),
        createVector(1, 1),
        createVector(-1, 1)
      ];
  this.indicies = indicies || [0, 1, 2, 0, 3, 2];

  const pointX = i => this.verticies[i].x * this.scale + this.pos.x;
  const pointY = i => this.verticies[i].y * this.scale + this.pos.y;
  return {
    position: () => this.pos,
    aabb: (tolerance = 0.2) => {
      let minX = pointX(0);
      let maxX = minX;
      let minY = pointY(0);
      let maxY = minY;
      for (let i = 1; i < this.verticies.length; i++) {
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
      for (let i = 0; i < this.indicies.length - 2; i += 3) {
        observer(
          pointX(this.indicies[i]),
          pointY(this.indicies[i]),
          pointX(this.indicies[i+1]),
          pointY(this.indicies[i+1]),
          pointX(this.indicies[i+2]),
          pointY(this.indicies[i+2])
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
