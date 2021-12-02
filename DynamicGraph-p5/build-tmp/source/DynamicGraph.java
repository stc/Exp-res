import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class DynamicGraph extends PApplet {

/*

Code created for Network Visualization Workshop:
Random Graph Generation Studies
Built w/ Processing3

*/

ArrayList<Node> nodes = new ArrayList<Node>();
float energy;
boolean firstRun;
Utils utils;

public void setup() {
  
  
  utils = new Utils();
  nodes = utils.getNodes();
  firstRun = true;
}

public void draw() {
  background(235,232,230);
  if(!inEquilibrium()) {
    updateVelocities();
    moveNodes();
  }
  drawNodes();
}

public void mouseDragged() {}
public void mouseMoved() {}

public void keyPressed() {
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

public void updateVelocities() {
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null) {
      nodes.get(i).applySpring();
      nodes.get(i).applyRepulsion();
      nodes.get(i).dampen();
    }
  }
}

//draws all of the Nodes, with Node "id" highlighted
public void drawNodes() {
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      nodes.get(i).drawLines();
  }
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      nodes.get(i).drawNode();
  }
}

public void moveNodes() {
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      nodes.get(i).move();
  }
}

public boolean inEquilibrium() {
  if(firstRun) {
    firstRun = false;
    return false;
  }
  energy = 0;
  for(int i = 0; i < nodes.size(); i++) {
    if(nodes.get(i) != null)
      energy += nodes.get(i).getEnergy();
  }
  return energy < .1f;
}
class Edge {
  private Node other;
  private float strength; // ideal length of the spring connection
  
  public Edge(Node _other, float _strength) {
    other = _other;
    strength = _strength;
  }
  
  public Node getOther() {
    return other;
  }
  
  public float getStrength() {
    return strength;
  }
}
class Node {
  private float x, y;
  private float radius;
  private ArrayList edges;
  private ArrayList < Node > nodes = new ArrayList<Node>();
  private int numNodes;
  private int numEdges;
  private int id;
  private float xvel, yvel;
  private final float k = .9f;  // spring constant
  private final float dampening = .04f; 
  private final float c = 25000; // repulsion constant
  
  public Node(int _id) {
    radius = .001f * (width + height);
    x = random(radius, width - radius);
    y = random(radius, height - radius);
    edges = new ArrayList();
    numEdges = 0;
    id = _id;
    xvel = 0;
    yvel = 0;
  }
  
  public void giveNodes(ArrayList<Node> _nodes, int _numNodes) {
    nodes = _nodes;
    numNodes = _numNodes;
  }
  
  public void addEdge(Edge theEdge) {
    edges.add(theEdge);
    numEdges++;
  }
  
  public float getRadius() {
    return radius;
  }
  
  public int getID() {
    return id;
  }
  
  public void setX(float _x) {
    x = _x;
  }
  
  public void setY(float _y) {
    y = _y;
  }
  
  public float getX() {
    return x;
  }
  
  public float getY() {
    return y;
  }
  
  public void drawLines() {
    Node other;
    for(int i = 0; i < numEdges; i++) {
      other = ((Edge)edges.get(i)).getOther();
      stroke(0,30);
      line(x, y, other.getX(), other.getY());
    }
  }
  
  public void drawNode() {
    noStroke();
    fill(0,150);
    ellipse(x, y, radius * 2 * ((numEdges+1)/2.0f), radius * 2 * ((numEdges+1)/2.0f));
    
  }
  
  public boolean hasEdge(int otherID) {
    Edge theEdge;
    for(int i = 0; i < numEdges; i++) {
      theEdge = (Edge)edges.get(i);
      if(theEdge.getOther().getID() == otherID)
        return true;
    }
    return false;
  }
  
  private float getDistance(float otherX, float otherY) {
    return sqrt((otherX-x) * (otherX-x) + (otherY-y) * (otherY-y));
  }
  
  private boolean isNeighbor(Node other) {
    Edge theEdge;
    for(int i = 0; i < numEdges; i++) {
      theEdge = (Edge)edges.get(i);
      if(other == theEdge.getOther())
        return true;
    }
    return false;
  }
  
  public void applySpring() {
    float forceX = 0;
    float forceY = 0;
    float otherX, otherY, distance;
    Edge theEdge;
    Node other;
    for(int i = 0; i < numEdges; i++) {
      theEdge = (Edge)edges.get(i);
      other = theEdge.getOther();
      otherX = other.getX();
      otherY = other.getY();
      distance = getDistance(otherX, otherY);
      forceX += k * (distance - theEdge.getStrength()) * ((otherX - x) / distance);
      forceY += k * (distance - theEdge.getStrength()) * ((otherY - y) / distance);
    }
    xvel += forceX;
    yvel += forceY;
  }
  
  public void applyRepulsion() {
    float forceX = 0;
    float forceY = 0;
    float otherX, otherY, distance;
    Edge theEdge;
    Node other;
    for(int i = 0; i < numNodes; i++) {
      if((nodes.get(i) != null) && (nodes.get(i) != this)) {
        other = nodes.get(i);
        otherX = other.getX();
        otherY = other.getY();
        distance = getDistance(otherX, otherY);
        if(!isNeighbor(other)) { // only consider the repulsion due to non-neighbors
          forceX += (c / (distance * distance)) * ((otherX - x) / distance);
          forceY += (c / (distance * distance)) * ((otherY - y) / distance);
        }
      }
    }
    xvel -= forceX;
    yvel -= forceY;
  }
  
  public void dampen() {
    xvel *= dampening;
    yvel *= dampening;
  }
  
  public void move() {
    x += xvel;
    y += yvel;
    checkBorders();
  }
  
  private void checkBorders() {
    if((x - radius) < 0) {
      xvel = -1 * xvel;
      x += xvel * 2;
    }
    else if((x + radius) > width) {
      xvel = -1 * xvel;
      x += xvel * 2;
    }
    if((y - radius) < 0) {
      yvel = -1 * yvel;
      y += yvel * 2;
    }
    else if((y + radius) > height) {
      yvel = -1 * yvel;
      y += yvel * 2;
    }
  }
  
  public void stopVel() {
    xvel = 0;
    yvel = 0;
  }
  
  public float getEnergy() {
    float velocity = sqrt((xvel*xvel) + (yvel*yvel));
    return velocity * velocity;
  }
    
  public String toString() {
    String theString = "Node " + id + " has connections to:\n";
    Edge theEdge;
    for(int i = 0; i < numEdges; i++) {
      theEdge = (Edge)edges.get(i);
      theString  += "\t" + theEdge.getOther().getID() + " with strength " + theEdge.getStrength() + "\n"; 
    }
    return theString;
  }   
}
class Utils {
  private ArrayList< Node > nodes;
  
  public Utils() {
    init();
  }
  
  public void init() {
    nodes = new ArrayList<Node>();
    Node n = new Node(0);
    nodes.add(n);
  }
  
  public Utils(String filename) {
    String lines[] = loadStrings(filename);
    int length = lines.length;
    int highest = highestID(lines);
    nodes = new ArrayList<Node>();
    for(int i=0; i< highest+1; i++) {
      nodes.add(new Node(-1));
    }
    Node node1, node2;
    int num;
    String temp[];
    Edge theEdge;
    
    for(int i = 0; i < length; i++) {
      temp = split(lines[i], ',');
      num = PApplet.parseInt(temp[0]);
      if(nodes.get(num) == null)
        nodes.set(num,new Node(num));
      node1 = nodes.get(num);
      num = PApplet.parseInt(temp[1]);
      if(nodes.get(num) == null)
        nodes.set(num,new Node(num));
      node2 = nodes.get(num);
      if(!node1.hasEdge(num)) { // make sure to not add duplicates
        node1.addEdge(new Edge(node2, PApplet.parseFloat(temp[2])));
        node2.addEdge(new Edge(node1, PApplet.parseFloat(temp[2])));
      }
    }
    
    for(int i = 0; i <= highest; i++) {
      if(nodes.get(i) != null)
        nodes.get(i).giveNodes(nodes, highest + 1);
    }
  }
  
  public void addNode(ArrayList<Node> nodes) {
    int hID = 0;
    for(int i=0; i< nodes.size(); i++) {
      if(i>0) {
        if(nodes.get(i).id>nodes.get(i-1).id) {
          hID = nodes.get(i).id;
        }
      }
    }
    
    int otherNodeID = 0;
    float weight = 50;
    Node nodeNew = new Node(hID+1);
    nodes.add(nodeNew);
    Node nodeOther = nodes.get(otherNodeID);
    if(!nodeNew.hasEdge(otherNodeID)) {
      nodeNew.addEdge(new Edge(nodeOther, weight));
      nodeOther.addEdge(new Edge(nodeNew, weight));
    }
  }
  
  public void addRandomOne(ArrayList<Node> nodes) {
    int hID = highestID(nodes);
    
    Node nodeNew = new Node(hID+1);
    nodes.add(nodeNew);
    
    int otherNodeID = PApplet.parseInt(random(hID));
    float weight = random(100)+10;
    Node nodeOther = nodes.get(otherNodeID);
    if(!nodeNew.hasEdge(otherNodeID)) {
      nodeNew.addEdge(new Edge(nodeOther, weight));
      nodeOther.addEdge(new Edge(nodeNew, weight));
    }
    for(int i = 0; i <= hID+1; i++) {
      if(nodes.get(i) != null)
        nodes.get(i).giveNodes(nodes, hID + 1);
    }
  }
  
  public void addAll(ArrayList<Node> nodes) {
    int hID = highestID(nodes);
    Node nodeNew = new Node(hID+1);
    
    
    for(int i=0; i<nodes.size(); i++) {
      int otherNodeID = nodes.get(i).id;
      float weight = random(100)+10;
      Node nodeOther = nodes.get(otherNodeID);
      if(!nodeNew.hasEdge(otherNodeID)) {
        nodeNew.addEdge(new Edge(nodeOther, weight));
        nodeOther.addEdge(new Edge(nodeNew, weight));
      }
    }
    nodes.add(nodeNew);
    for(int i = 0; i <= hID+1; i++) {
      if(nodes.get(i) != null)
        nodes.get(i).giveNodes(nodes, hID + 1);
    }
  }
  
  public void addRandomAll(ArrayList<Node> nodes) {
    int hID = highestID(nodes);
    Node nodeNew = new Node(hID+1);
    
    for(int i=0; i<nodes.size(); i++) {
      int otherNodeID = nodes.get(i).id;
      float weight = random(100)+10;
      int prob = PApplet.parseInt(random(10));
      if(prob==0) {
        Node nodeOther = nodes.get(otherNodeID);
        if(!nodeNew.hasEdge(otherNodeID)) {
          nodeNew.addEdge(new Edge(nodeOther, weight));
          nodeOther.addEdge(new Edge(nodeNew, weight));
        }
      }
    }
    nodes.add(nodeNew);
    for(int i = 0; i <= hID+1; i++) {
      if(nodes.get(i) != null)
        nodes.get(i).giveNodes(nodes, hID + 1);
    }
  }
  public void addWeightedRandom(ArrayList<Node> nodes) {
    int hID = highestID(nodes);
    Node nodeNew = new Node(hID+1);
    int rndConn;
    if(nodes.size()<3) {
      rndConn = PApplet.parseInt(random(nodes.size()));
    } else {
      rndConn = PApplet.parseInt(random(3));
    }
    int otherNodeID = rndConn;
    
    float weight = random(100)+10;
    Node nodeOther = nodes.get(otherNodeID);
    if(!nodeNew.hasEdge(otherNodeID)) {
      nodeNew.addEdge(new Edge(nodeOther, weight));
      nodeOther.addEdge(new Edge(nodeNew, weight));
    }
    nodes.add(nodeNew);
    for(int i = 0; i <= hID+1; i++) {
      if(nodes.get(i) != null)
        nodes.get(i).giveNodes(nodes, hID + 1);
    }
  }
  
  public ArrayList<Node> getNodes() {
    return nodes;
  }
  
  private int highestID(ArrayList<Node> nodes) {
    int hID = 0;
    for(int i=0; i< nodes.size(); i++) {
      if(i>0) {
        if(nodes.get(i).id>nodes.get(i-1).id) {
          hID = nodes.get(i).id;
        }
      }
    }
    return hID;
  }
  
  private int highestID(String lines[]) {
    String temp[];
    temp = split(lines[0], ',');
    int highest = 0;
    if(PApplet.parseInt(temp[0]) > PApplet.parseInt(temp[1]))
      highest = PApplet.parseInt(temp[0]);
    else
      highest = PApplet.parseInt(temp[1]);
    int num = 0;
    int length = lines.length;
    for(int i = 0; i < length; i++) {
      temp = split(lines[i], ',');
      num = PApplet.parseInt(temp[0]);
      if(num > highest)
        highest = num;
      num = PApplet.parseInt(temp[1]);
      if(num > highest)
        highest = num;
    }
    return highest;
  }
}
  public void settings() {  size(1000, 500, P3D);  pixelDensity(2); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "--present", "--window-color=#666666", "--stop-color=#cccccc", "DynamicGraph" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
