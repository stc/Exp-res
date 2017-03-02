#include "ofApp.h"

void ofApp::setup(){
    isConnected = false;
    address = "https://127.0.0.1:8080";
    status = "not connected";
    
    searchPhrase = "weekend";
    
    std::map<std::string,std::string> query;
    query["phrase"] = searchPhrase;
    socketIO.setup(address, query);
    
    ofAddListener(socketIO.notifyEvent, this, &ofApp::gotEvent);
    ofAddListener(socketIO.connectionEvent, this, &ofApp::onConnection);
}

void ofApp::onConnection() {
    isConnected = true;
    bindEvents();
}

void ofApp::bindEvents() {
    string serverEventName = "tweet";
    socketIO.bindEvent(serverEvent, serverEventName);
    ofAddListener(serverEvent, this, &ofApp::onServerEvent);
}

void ofApp::update(){}

void ofApp::draw(){
    ofBackground(30);
    ofSetColor(255);
    ofDrawBitmapString(searchPhrase, 20, 20);
    ofDrawLine(0,ofGetHeight()/2,ofGetWidth(),ofGetHeight()/2);
    
    float sum = 0;
    for(auto dp : datapoints) {
        dp->draw(ofVec2f(mouseX,mouseY));
        sum+=dp->mMood;
    }
    avgMood = sum/datapoints.size();
    ofSetColor(125,212,255, 100);
    ofDrawLine(0,ofGetHeight() / 2 - avgMood * 20,ofGetWidth(), ofGetHeight() / 2 - avgMood * 20);
    ofDrawBitmapString("Average mood: " + ofToString(avgMood), 20, 40);
    
    if(avgMood>0.5) {
        ofDrawBitmapString("+", 20, 60);
    } else if(avgMood<-0.5) {
        ofDrawBitmapString("-", 20, 60);
    }
}

void ofApp::onServerEvent(ofxSocketIOData& data) {
    tCount++;
    datapoints.push_back(new DataPoint(data.getStringValue("tText"), data.getStringValue("tDate"), data.getFloatValue("tMood"), ofVec2f(tCount * dSize, ofGetHeight() / 2), dSize));
}

void ofApp::gotEvent(string& name) {
    status = name;
}

void ofApp::exit() {
    string s = "stopStream";
    socketIO.emit(s);
}

void ofApp::keyPressed(int key){}
void ofApp::keyReleased(int key){}
void ofApp::mouseMoved(int x, int y ){}
void ofApp::mouseDragged(int x, int y, int button){}
void ofApp::mousePressed(int x, int y, int button){}
void ofApp::mouseReleased(int x, int y, int button){}
void ofApp::mouseEntered(int x, int y){}
void ofApp::mouseExited(int x, int y){}
void ofApp::windowResized(int w, int h){}
void ofApp::gotMessage(ofMessage msg){}
void ofApp::dragEvent(ofDragInfo dragInfo){}
