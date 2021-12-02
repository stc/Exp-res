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