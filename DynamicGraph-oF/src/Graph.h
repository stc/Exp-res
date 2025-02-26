#pragma once
#include "ofMain.h"
#include "Node.h"

class Graph {
public:
    Graph();
    void update();
    void drawNodes();
    void pressed();
    void released();
    void applyForces();
    
    int findNode(Node * n);
    void registerNewNode(int latestNodeId, int pitch);
    void addNode(Node * n);
    void addEdge(int nodeId1, int nodeId2);
    void drawEdges(int latestNodeId);
    void getNextNode(int latestNodeId);
    void genRandomGraph();
    
    vector<Node*> mNodes;
    vector<int> mNodeIds;
    vector<vector<int>> mEdges;
    int mNumberOfEdges;
    
    ofEvent<int> onNewNodeRegistered;
    ofEvent<int> onNodeIdChanged;
    
    float mGravityConstant;
    float mForceConstant;
    float mRepulsionStrength;
    
    bool mTouched;
    float mInterpolValue;
    Node * mCloseNode;
};
