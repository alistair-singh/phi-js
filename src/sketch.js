
var hulls;
var crateImage;

function ConvexHull(pos, scale, rotation, center, verticies, indicies) {
  this._pos = pos || createVector(0, 0);
  this._scale = scale || 1;
  this._rotation = rotation || 1;
  this._center = center || createVector(0, 0);
  this._verticies = verticies ||
    [
      createVector(-1, -1),
      createVector(1, -1),
      createVector(1, 1),
      createVector(-1, 1)
    ];
  this._indicies = indicies || [0, 1, 2, 0, 3, 2];

  const worldX = i => ((this._verticies[i].x * this._scale * Math.cos(this._rotation)) - (this._verticies[i].y * this._scale * Math.sin(this._rotation))) + this._pos.x;
  const worldY = i => ((this._verticies[i].x * this._scale * Math.sin(this._rotation)) + (this._verticies[i].y * this._scale * Math.cos(this._rotation))) + this._pos.y;
  this.position = () => this._pos;
  this.rotation = (r = this._rotation) => this._rotation = r;
  this.scale = () => this._scale;
  this.draw = () => { image(crateImage, -1, -1, 2, 2); };
  this.aabb = (tolerance = 0.2) => {
    let minX = worldX(0);
    let maxX = minX;
    let minY = worldY(0);
    let maxY = minY;
    for (let i = 1; i < this._verticies.length; i++) {
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
  };
  this.triangles = (observer) => {
    for (let i = 0; i < this._indicies.length - 2; i += 3) {
      observer(
        worldX(this._indicies[i]),
        worldY(this._indicies[i]),
        worldX(this._indicies[i + 1]),
        worldY(this._indicies[i + 1]),
        worldX(this._indicies[i + 2]),
        worldY(this._indicies[i + 2])
      );
    };
  };

  return this;
}

function setup() {
  createCanvas(480, 480);
  hulls = [new ConvexHull(createVector(240, 240), 50, PI / 6)];
  crateImage = loadImage("crate.jpg");
}

var showModel = true;
var showHull = true;
var showAABB = true;
function draw() {
  background(200);
  hulls.forEach(h => {

    var s = h.rotation(h.rotation() + 0.01)

    if (showModel) {
      push();
      const pos = h.position();
      translate(pos.x, pos.y);
      rotate(h.rotation());
      scale(h.scale());
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
