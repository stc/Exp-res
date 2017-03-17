#include "ofApp.h"

void ofApp::setup(){
    ofSetBackgroundAuto(false);
    ofBackground(230);
    
    gui.setup();
    gui.add(scale.set("scale", 0.014, 0.0, 0.1));
}

void ofApp::update(){
    tsnePoints = tsne.iterate();
    for (int i=0; i<testPoints.size(); i++) {
        testPoints[i].tsnePoint = ofPoint(tsnePoints[i][0], tsnePoints[i][1]);
    }
}

void ofApp::draw(){
    ofPushMatrix();
    ofTranslate(-ofGetWidth() * (scale - 0.5), -ofGetHeight() * (scale - 0.5));
    for (int i=0; i<testPoints.size(); i++) {
        if(i<datapoints.size()) {
            float x = ofMap(testPoints[i].tsnePoint.x, 0, 1, 0, scale * ofGetWidth());
            float y = ofMap(testPoints[i].tsnePoint.y, 0, 1, 0, scale * ofGetHeight());
            datapoints[i]->mPos = ofPoint(x,y);
            datapoints[i]->draw();
        }
    }
    ofPopMatrix();
    gui.draw();
}

void ofApp::loadData() {
    datapoints.clear();
    ofxJSONElement dp;
    bool parsingSuccessful = dp.open(ofToDataPath("world.json"));
    if (parsingSuccessful) {
        for (Json::ArrayIndex i = 0; i < dp.size(); ++i){
            datapoints.push_back(new DataPoint(dp[i]["date"].asString(),dp[i]["text"].asString(),dp[i]["score"].asInt(),dp[i]["comp"].asFloat()));
        }
    }else {
        ofLogError("Failed to parse JSON file of positions");
    }
}

void ofApp::calcTSNE() {
    testPoints.clear();
    for(int i=0; i<datapoints.size(); i++) {
        TestPoint testPoint;
        vector<float> point;
        point.resize(2);
        point[0] = datapoints[i]->mScore;
        point[1] = datapoints[i]->mComp;
        
        testPoint.point = point;
        testPoints.push_back(testPoint);
    }
    vector< vector<float> > data;
    for (int i = 0; i < testPoints.size(); i++) {
        data.push_back(testPoints[i].point);
    }
    
    int dims = 2;
    float perplexity = 35;
    float theta = 0.95;
    bool normalize = false;
    
    tsnePoints = tsne.run(data, dims, perplexity, theta, normalize, true);
}

void ofApp::keyPressed(int key){
    if(key == 'l') {
        loadData();
    }
    if(key == 't') {
        calcTSNE();
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
