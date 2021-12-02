#include "Graph.h"

/*
    physics related: should we change node mass values & mRepStr val?
    time related: should we consider storing and reusing time between new nodes/edges added?
*/

Graph::Graph(){
    mNumberOfEdges = 0;
    mGravityConstant = 1.1;
    mForceConstant = 1000;
    mRepulsionStrength = 1;
}

void Graph::update() {
    applyForces();
    for(auto n : mNodes) {
        n->update();
    }
}

void Graph::applyForces() {
    // apply force towards centre
    for(auto n : mNodes) {
        ofVec2f gravity = ofVec2f( n->mPos.x, n->mPos.y ) * -1 * mGravityConstant;
        n->mForce = gravity;
    }
    
    // apply repulsive force between nodes
    for(int i=0; i<mNodes.size(); i++) {
        for(int j=i+1; j<mNodes.size(); j++) {
            ofVec2f pos = mNodes[i]->mPos;
            ofVec2f dir = ofVec2f( mNodes[j]->mPos.x, mNodes[j]->mPos.y ) - pos;
            ofVec2f force = dir / ( dir.length() * dir.length() ) * mRepulsionStrength;
            force *= mForceConstant;
            mNodes[i]->mForce += ofVec2f( force.x, force.y ) * -1;
            mNodes[j]->mForce += force;
        }
    }
    
    // apply forces based on edges
    for(int i=0; i<mNodes.size(); i++) {
        if(i<mEdges.size()) {
            ofVec2f dis = ofVec2f(mNodes[mEdges[i][0]]->mPos.x,mNodes[mEdges[i][0]]->mPos.y) - mNodes[mEdges[i][1]]->mPos;
            mNodes[mEdges[i][0]]->mForce -= dis;
            mNodes[mEdges[i][1]]->mForce += dis;
        }
    }
}

void Graph::drawNodes() {
    for(auto n : mNodes) {
        n->draw();
    }
}

void Graph::drawEdges(int latestNodeId){
    for(int i=0; i<mEdges.size(); i++) {
        int startNode = i;
        if(startNode == latestNodeId) {
            // display number of latest node's edges
            ofSetColor(255);
            ofDrawBitmapString(ofToString(mEdges[i].size()),mNodes[startNode]->mPos.x+20,mNodes[startNode]->mPos.y);
        }
        
        for(int j=0; j<mEdges[i].size();j++) {
            int endNode = mEdges[i][j];
            ofNoFill();
            ofSetColor(255,100);
            ofVec2f v1 = ofVec2f(mNodes[startNode]->mPos.x, mNodes[startNode]->mPos.y);
            ofVec2f v2 = ofVec2f(mNodes[endNode]->mPos.x, mNodes[endNode]->mPos.y);
            //ofDrawLine(v1,v2);
            
            //if(j==1) {
                ofBeginShape();
                ofVertex(v1.x,v1.y);
                ofBezierVertex(ofVec2f(v1.x,v1.y).interpolate(ofVec2f(v2.x,v2.y),0.33).rotate(10),
                               ofVec2f(v1.x,v1.y).interpolate(ofVec2f(v2.x,v2.y),0.66).rotate(10), v2);
                ofEndShape();
            //}
        }
    }
}

int Graph::findNode(Node * n){
    for(int i=0; i<mNodes.size(); i++) {
        if(n->isSimilar(mNodes[i])) {
            return i;
        }
    }
    return -1;
}

void Graph::getNextNode(int latestNodeId) {
    // random walk over the graph edges:
    if (mEdges[latestNodeId].size()>0) {
        int nodeId = mEdges[latestNodeId][ floor(ofRandom( mEdges[latestNodeId].size() ))];
        //ofNotifyEvent(onNodeIdChanged, nodeId);
    }
}

void Graph::registerNewNode(int latestNodeId, int pitch){
    Node * n = new Node(0, pitch);
    int nodeId = findNode(n);
    if(nodeId==-1) {
        nodeId = mNodes.size();
        addNode(n);
    }
    n->mId = nodeId;
    if(latestNodeId != -99) {
        addEdge(latestNodeId, nodeId);
    }
    ofNotifyEvent(onNewNodeRegistered, nodeId);
}

void Graph::addNode(Node * n){
    int nodeId = mNodes.size();
    mNodeIds.push_back(nodeId);
    mNodes.push_back(n);
    vector<int> v;
    v.push_back(nodeId);
    mEdges.push_back(v);
}

void Graph::addEdge(int nodeId1, int nodeId2){
    mEdges[nodeId1].push_back(nodeId2);
    mNumberOfEdges++;
}

void Graph::genRandomGraph() {
    for(int i=0; i< 50; i++) {
        Node * n = new Node(i, i);
        mNodes.push_back(n);
    }
    
    for(int i=0; i< 30; i++) {
        vector<int>v;
        v. push_back(floor(ofRandom(0,10)));
        v. push_back(floor(ofRandom(11,29)));
        mEdges.push_back( v );
    }
}

