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
      num = int(temp[0]);
      if(nodes.get(num) == null)
        nodes.set(num,new Node(num));
      node1 = nodes.get(num);
      num = int(temp[1]);
      if(nodes.get(num) == null)
        nodes.set(num,new Node(num));
      node2 = nodes.get(num);
      if(!node1.hasEdge(num)) { // make sure to not add duplicates
        node1.addEdge(new Edge(node2, float(temp[2])));
        node2.addEdge(new Edge(node1, float(temp[2])));
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
    
    int otherNodeID = int(random(hID));
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
      int prob = int(random(10));
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
      rndConn = int(random(nodes.size()));
    } else {
      rndConn = int(random(3));
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
    if(int(temp[0]) > int(temp[1]))
      highest = int(temp[0]);
    else
      highest = int(temp[1]);
    int num = 0;
    int length = lines.length;
    for(int i = 0; i < length; i++) {
      temp = split(lines[i], ',');
      num = int(temp[0]);
      if(num > highest)
        highest = num;
      num = int(temp[1]);
      if(num > highest)
        highest = num;
    }
    return highest;
  }
}