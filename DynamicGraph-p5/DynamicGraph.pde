/*

Code created for Network Visualization Workshop:
Random Graph Generation Studies
Built w/ Processing3

*/

ArrayList<Node> nodes = new ArrayList<Node>();
float energy;
boolean firstRun;
Utils utils;

void setup() {
  size(1000, 500, P3D);
  pixelDensity(2);
  utils = new Utils();
  nodes = utils.getNodes();
  firstRun = true;
}

void draw() {
  background(235,232,230);
  if(!inEquilibrium()) {
    updateVelocities();
    moveNodes();
  }
  drawNodes();
}

void mouseDragged() {}
void mouseMoved() {}

void keyPressed() {
  if(key == '1') {
    utils.addRandomOne(nodes);
    firstRun = true;
  } else if(key == '2') {
    utils.addAll(nodes);
    firstRun = true;
  } else if(key == '3') {
    utils.addRandomAll(nodes);
    firstRun = true;
  } else if(key == '4') {
    utils.addWeightedRandom(nodes);
    firstRun = true;
  } 
}

void updateVelocities() {
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null) {
      nodes.get(i).applySpring();
      nodes.get(i).applyRepulsion();
      nodes.get(i).dampen();
    }
  }
}

//draws all of the Nodes, with Node "id" highlighted
void drawNodes() {
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      nodes.get(i).drawLines();
  }
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      nodes.get(i).drawNode();
  }
}

void moveNodes() {
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      nodes.get(i).move();
  }
}

boolean inEquilibrium() {
  if(firstRun) {
    firstRun = false;
    return false;
  }
  energy = 0;
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      energy += nodes.get(i).getEnergy();
  }
  return energy < .1;
}