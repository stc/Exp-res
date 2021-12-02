#include "ofApp.h"

void ofApp::setup(){
    graph = Graph();
    latestNodeId = -99;
    ofAddListener(graph.onNewNodeRegistered, this, &ofApp::onNewNodeRegistered);
    
    touched = false;
    interpolValue = 0.2;
}

void ofApp::update(){
    graph.update();
}

void ofApp::draw(){
    ofBackgroundGradient( ofColor(10,10,20), ofColor(0,0,0), OF_GRADIENT_CIRCULAR);
    
    ofPushMatrix();
    ofTranslate( ofGetWidth()/2, ofGetHeight()/2);
    graph.drawEdges(latestNodeId);
    graph.drawNodes();
    ofPopMatrix();
    
    if(touched) {
        if(graph.mNodes.size() > 0) {
            ofVec2f touchPos = ofVec2f(ofGetMouseX() - ofGetWidth()/2, ofGetMouseY() - ofGetHeight()/2);
            closeNode->mPos.interpolate(touchPos, interpolValue);
            if(interpolValue < 0.95) {
                interpolValue += 0.02;
            }
        }
    }
}

void ofApp::onNewNodeRegistered(int & nId) {
    latestNodeId = nId;
}

void ofApp::keyPressed(int key){
    if(key == 'a') graph.registerNewNode(latestNodeId, 100);
    if(key == 's') graph.registerNewNode(latestNodeId, 150);
    if(key == 'd') graph.registerNewNode(latestNodeId, 200);
    if(key == 'f') graph.registerNewNode(latestNodeId, 250);
    if(key == ' ') graph.genRandomGraph();
}

void ofApp::keyReleased(int key){

}

void ofApp::mouseMoved(int x, int y ){

}

void ofApp::mouseDragged(int x, int y, int button){

}

void ofApp::mousePressed(int x, int y, int button){
    //graph.getNextNode(latestNodeId);
    if(graph.mNodes.size() > 0) {
        closeNode = graph.mNodes[0];
        touched = true;
        ofVec2f touchPos = ofVec2f(ofGetMouseX() - ofGetWidth()/2, ofGetMouseY() - ofGetHeight()/2);
        for(auto n : graph.mNodes) {
            if( ofVec2f(ofVec2f(touchPos.x, touchPos.y) - n->mPos).length() - closeNode->mMass / (2 * PI) <
               ofVec2f(ofVec2f(touchPos.x, touchPos.y) - closeNode->mPos).length() - closeNode->mMass / (2 * PI) ) {
                closeNode = n;
            }
        }
    }
}

void ofApp::mouseReleased(int x, int y, int button){
    touched = false;
    interpolValue = 0.2;
}

void ofApp::mouseEntered(int x, int y){

}

void ofApp::mouseExited(int x, int y){

}

void ofApp::windowResized(int w, int h){

}

void ofApp::gotMessage(ofMessage msg){

}

void ofApp::dragEvent(ofDragInfo dragInfo){

}
