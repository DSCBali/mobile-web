function Plane(numEngines) {
  this.numEngines = numEngines;
  this.enginesActive = false;
}

Plane.prototype.startEngines = function() {
  console.log('starting engines...');
  console.log(`Engines num: ${this.numEngines}`);
  this.enginesActive = true;
};

const planeA = new Plane(1);
planeA.startEngines();

const planeB = new Plane(4);
planeB.startEngines();
