#include "ofApp.h"

void ofApp::setup(){
    graph = Graph();
    latestNodeId = -99;
    ofAddListener(graph.onNewNodeRegistered, this, &ofApp::onNewNodeRegistered);
    ofAddListener(graph.onNodeIdChanged, this, &ofApp::onNodeIdChanged);
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
}

void ofApp::onNewNodeRegistered(int & nId) {
    latestNodeId = nId;
}

void ofApp::onNodeIdChanged(int & nId) {
    latestNodeId = nId;
}

void ofApp::keyPressed(int key){
    if(key == 'a') graph.registerNewNode(latestNodeId, 100);
    if(key == 's') graph.registerNewNode(latestNodeId, 150);
    if(key == 'd') graph.registerNewNode(latestNodeId, 200);
    if(key == 'f') graph.registerNewNode(latestNodeId, 250);
    if(key == ' ') graph.genRandomGraph();
    if(key == 'n') graph.getNextNode(latestNodeId);
}

void ofApp::keyReleased(int key){

}

void ofApp::mouseMoved(int x, int y ){

}

void ofApp::mouseDragged(int x, int y, int button){

}

void ofApp::mousePressed(int x, int y, int button){
    graph.pressed();
}

void ofApp::mouseReleased(int x, int y, int button){
    graph.released();
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
