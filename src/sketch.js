
function AABB(minX, minY, maxX, maxY) {
  this.minX = minX || 0;
  this.minY = minY || 0;
  this.maxX = maxX || 0;
  this.maxY = maxY || 0;
  this.merge = function (other) {
    return new AABB(
      Math.min(this.minX, other.minX),
      Math.min(this.minY, other.minY),
      Math.max(this.maxX, other.maxX),
      Math.max(this.maxY, other.maxY));
  };
  this.area = function () { return (this.maxX - this.minX) * (this.maxY - this.minY); }
  this.manhattan = function () { return (this.minX + this.maxX) + (this.minY + this.maxY); }
}

function Tree(root) {
  const NODE_EMPTY = 0;
  const NODE_BRANCH = 1;
  const NODE_LEAF = 2;

  function Empty() {
    this.type = NODE_EMPTY;
    this.aabb = new AABB();
  }
  function Leaf(item) {
    this.type = NODE_LEAF;
    this.item = item;
    this.aabb = item.aabb(4);
  }
  function Branch(left, right) {
    this.type = NODE_BRANCH;
    this.left = left || new Empty();
    this.right = right || new Empty();
    this.aabb = new AABB();

    const rAABB = (right.type !== NODE_EMPTY ? right.aabb : left.aabb) || new AABB();
    const lAABB = (left.type !== NODE_EMPTY ? left.aabb : right.aabb) || new AABB();
    this.aabb = rAABB.merge(lAABB);
  }

  this.root = root || new Empty();
  this.insert = function (item) {
    switch (this.root.type) {
      case NODE_EMPTY:
        return new Tree(new Leaf(item));
      case NODE_BRANCH:
        return new Tree(new Branch(this.root, new Leaf(item)));
      case NODE_LEAF:
        return new Tree(new Branch(this.root, new Leaf(item)));
    }
  };
  this.visit = function (visitor) {
    function _visit(node) {
      switch (node.type) {
        case NODE_EMPTY: break;
        case NODE_BRANCH:
          _visit(node.left);
          visitor(node);
          _visit(node.right);
          break;
        case NODE_LEAF:
          visitor(node);
          break;
      }
    }
    _visit(this.root);
  };
}

var hulls;
var crateImage;
var tree;

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
    return new AABB(
      minX - tolerance, minY - tolerance,
      maxX + tolerance, maxY + tolerance);
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
}

function setup() {
  createCanvas(480, 480);
  hulls = [
    new ConvexHull(createVector(240, 240), 50, PI / 6),
    new ConvexHull(createVector(120, 120), 25, PI / 3),
    new ConvexHull(createVector(331, 170), 25, PI / 4),
    new ConvexHull(createVector(330, 260), 25, PI / 9)];

  tree = new Tree();
  hulls.forEach((h, i) => tree = tree.insert(h))
  crateImage = loadImage("crate.jpg");
}

var showModel = true;
var showHull = true;
var showAABB = true;
var showAABBTree = true;
function draw() {
  function drawAABB(aabb) {
    line(aabb.minX, aabb.minY, aabb.minX, aabb.maxY);
    line(aabb.minX, aabb.minY, aabb.maxX, aabb.minY);

    line(aabb.maxX, aabb.minY, aabb.maxX, aabb.maxY);
    line(aabb.minX, aabb.maxY, aabb.maxX, aabb.maxY);
  };

  background(200);

  if (showModel) {
    hulls.forEach((h, i) => {
      h.rotation(h.rotation() + 0.01);
      push();
      const pos = h.position();
      translate(pos.x, pos.y);
      rotate(h.rotation());
      scale(h.scale());
      h.draw();
      pop();

      text("" + i, pos.x - 5, pos.y + 5);
    });
  };

  hulls.forEach(h => {
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
      drawAABB(aabb);
      pop();
    }
  });

  if (showAABBTree) {
    tree = new Tree();
    hulls.forEach((h, i) => tree = tree.insert(h))
    tree.visit(t => {
      if(t.type === 1) drawAABB(t.aabb);
    });
  }
}
