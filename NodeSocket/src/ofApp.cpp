#include "ofApp.h"

void ofApp::setup(){
    isConnected = false;
    address = "https://127.0.0.1:8080";
    status = "not connected";
    
    searchPhrase = "work";
    
    std::map<std::string,std::string> query;
    query["phrase"] = searchPhrase;
    socketIO.setup(address, query);
    
    ofAddListener(socketIO.notifyEvent, this, &ofApp::gotEvent);
    ofAddListener(socketIO.connectionEvent, this, &ofApp::onConnection);
    
    titleFont.load("lekton/Lekton-Italic.ttf", 36);
    textFont.load("lekton/Lekton-Regular.ttf", 10);
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
    ofBackground(240);
    
    ofSetColor(30);
    titleFont.drawString(searchPhrase,20,50);
    ofSetColor(30,50);
    ofDrawLine(0,ofGetHeight()/2,ofGetWidth(),ofGetHeight()/2);
    
    float sum = 0;
    for(auto dp : datapoints) {
        dp->draw(ofVec2f(mouseX,mouseY));
        sum+=dp->mMood;
    }
    avgMood = sum/datapoints.size();
    
    if(avgMood>0.5) {
        ofSetColor(75,162,205,255);
        titleFont.drawString("+", 20, 80);
    } else if(avgMood<-0.5) {
        ofSetColor(205,90,6,255);
        titleFont.drawString("-", 20, 80);
    } else {
        ofSetColor(30,100);
        titleFont.drawString(".", 20, 80);
    }
    textFont.drawString("Average mood: " + ofToString(avgMood), 60, 70);
    ofDrawLine(0,ofGetHeight() / 2 - avgMood * 20,ofGetWidth(), ofGetHeight() / 2 - avgMood * 20);
    

}

void ofApp::onServerEvent(ofxSocketIOData& data) {
    tCount++;
    datapoints.push_back(new DataPoint(data.getStringValue("tText"), data.getStringValue("tDate"), data.getFloatValue("tMood"), ofVec2f(tCount * dSize, ofGetHeight() / 2), dSize, textFont));
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
