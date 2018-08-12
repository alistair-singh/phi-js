
var hulls;
var crateImage;

var convexHull = (pos, scale_, rotation, center, verticies, indicies) => {
  this.pos = pos || createVector(0, 0);
  this.scale_ = scale_ || 1;
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

  const worldX = i => ((this.verticies[i].x * this.scale_ * Math.cos(this.rotation)) - (this.verticies[i].y * this.scale_ * Math.sin(this.rotation))) + this.pos.x;
  const worldY = i => ((this.verticies[i].x * this.scale_ * Math.sin(this.rotation)) + (this.verticies[i].y * this.scale_ * Math.cos(this.rotation))) + this.pos.y;
  return {
    position: () => this.pos,
    rotation: () => this.rotation,
    scale: () => this.scale_,
    draw: () => {
      image(crateImage, -1, -1, 2, 2);
    },
    aabb: (tolerance = 0.2) => {
      let minX = worldX(0);
      let maxX = minX;
      let minY = worldY(0);
      let maxY = minY;
      for (let i = 1; i < this.verticies.length; i++) {
        const x = worldX(i);
        const y = worldY(i);
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
          worldX(this.indicies[i]),
          worldY(this.indicies[i]),
          worldX(this.indicies[i + 1]),
          worldY(this.indicies[i + 1]),
          worldX(this.indicies[i + 2]),
          worldY(this.indicies[i + 2])
        );
      }
    }
  };
};

function setup() {
  createCanvas(480, 480);
  hulls = [convexHull(createVector(240, 240), 50, PI / 1)];
  crateImage = loadImage("crate.jpg");
}

var showModel = true;
var showHull = true;
var showAABB = true;
function draw() {
  background(200);
  hulls.forEach(h => {
    if (showModel) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.rotation);
      scale(this.scale_);
      h.draw();
      pop();
    }

    if (showHull) {
      push();
      stroke(0, 255, 0);
      h.triangles((x0, y0, x1, y1, x2, y2) => {
        line(x0, y0, x1, y1);
        line(x1, y1, x2, y2);
        line(x2, y2, x0, y0);
      });
      pop();
    }
    if (showAABB) {
      push();
      const aabb = h.aabb(2);
      stroke(255, 0, 0);
      line(aabb[0].x, aabb[0].y, aabb[0].x, aabb[1].y);
      line(aabb[0].x, aabb[0].y, aabb[1].x, aabb[0].y);

      line(aabb[1].x, aabb[0].y, aabb[1].x, aabb[1].y);
      line(aabb[0].x, aabb[1].y, aabb[1].x, aabb[1].y);
      pop();
    }
  });
}
