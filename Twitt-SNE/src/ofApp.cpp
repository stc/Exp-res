#include "ofApp.h"

void ofApp::setup(){

}

void ofApp::update(){

}

void ofApp::draw(){

}

void ofApp::loadData() {
    datapoints.clear();
    ofxJSONElement dp;
    bool parsingSuccessful = dp.open(ofToDataPath("weekend.json"));
    if (parsingSuccessful) {
        for (Json::ArrayIndex i = 0; i < dp.size(); ++i){
            datapoints.push_back(new DataPoint(dp[i]["date"].asString(),dp[i]["text"].asString(),dp[i]["score"].asInt(),dp[i]["comp"].asFloat()));
        }
    }else {
        ofLogError("Failed to parse JSON file of positions");
    }
}

void ofApp::keyPressed(int key){
    if(key == 'l') {
        loadData();
    }
}
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
