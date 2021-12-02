class Node {
  private float x, y;
  private float radius;
  private ArrayList edges;
  private ArrayList < Node > nodes = new ArrayList<Node>();
  private int numNodes;
  private int numEdges;
  private int id;
  private float xvel, yvel;
  private final float k = .9;  // spring constant
  private final float dampening = .04; 
  private final float c = 25000; // repulsion constant
  
  public Node(int _id) {
    radius = .001 * (width + height);
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
    ellipse(x, y, radius * 2 * ((numEdges+1)/2.0), radius * 2 * ((numEdges+1)/2.0));
    
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