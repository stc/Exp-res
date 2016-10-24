#include "ofApp.h"

void ofApp::setup(){
    ofBackground(30);
    
    oscSendingPort = 6448;
    oscInputAddress = "/wek/inputs";
    oscControlStart = "/wekinator/control/startRecording";
    oscControlStop = "/wekinator/control/stopRecording";

    oscHost = "localhost";
    sender.setup(oscHost, oscSendingPort);
    oscReceivingPort = 12000;
    receiver.setup(oscReceivingPort);
    
    s1.load("bird.wav");
    s1.setMultiPlay(true);
    s2.load("harmonic.wav");
    s2.setMultiPlay(true);
    s2.setLoop(true);
    s2.setVolume(0.2);
    s3.load("rhythm.wav");
    s3.setMultiPlay(true);
    s3.setLoop(true);
}

void ofApp::update(){
    if(mDrawing) {
        float a = atan2(cPos.y - pPos.y, cPos.x - pPos.x);
        float v = cPos.distance(pPos);
        if(features[features.size()-1].ang.size()<numFeatures) {
            features[features.size()-1].addDataPoint(cPos, v, ofRadToDeg(a));
        }
        pPos = cPos;
    }
    ofSoundUpdate();
}

void ofApp::draw(){
    for(auto f : features) f.drawDataPoints();
    int xOffset = 0;

    for(int i = 0; i< features.size(); i++) {
        features[i].drawFeatures(ofVec2f(xOffset * 220,ofGetHeight()/2 + i%7*features[i].h));
        if(i%7 == 6) {
            xOffset ++;
        }
    }
    if(mRecord) {
        ofSetColor(255,0,0);
        ofDrawCircle(30,30,15);
    } else {
        ofSetColor(200);
        ofDrawTriangle(10,10,20,20,10,30);
    }
    
    while(receiver.hasWaitingMessages()){
        ofxOscMessage m;
        receiver.getNextMessage(&m);
        // check for mouse moved message
        if(m.getAddress() == "/wek/outputs"){
            msg_string = ofToString(m.getArgAsInt(0));
            //if(pmsg_string != msg_string) {
            
                
                if(msg_string == "1") {
                    // add bird sound
                    s1.setSpeed(ofRandom(100)/100 + 0.5);
                    s1.play();
                    
                } else if(msg_string == "2") {
                    // add harmonic sound
                    s2.setSpeed(ofRandom(100)/100 + 1);
                    s2.play();

                    
                } else if(msg_string == "3") {
                    // add rhythm sound
                    s3.setSpeed(ofRandom(100)/100 + 0.5);
                    s3.play();
                }
                
                //pmsg_string = msg_string;
            //}
        }
        else{
            // unrecognized message: display on the bottom of the screen
            string msg_string;
            msg_string = m.getAddress();
            msg_string += ": ";
            for(int i = 0; i < m.getNumArgs(); i++){
                // get the argument type
                msg_string += m.getArgTypeName(i);
                msg_string += ":";
                // display the argument - make sure we get the right type
                if(m.getArgType(i) == OFXOSC_TYPE_INT32){
                    msg_string += ofToString(m.getArgAsInt32(i));
                }
                else if(m.getArgType(i) == OFXOSC_TYPE_FLOAT){
                    msg_string += ofToString(m.getArgAsFloat(i));
                }
                else if(m.getArgType(i) == OFXOSC_TYPE_STRING){
                    msg_string += m.getArgAsString(i);
                }
                else{
                    msg_string += "unknown";
                }
            }
            cout << msg_string << endl;
        }
    }
    
    ofSetColor(255);
    ofDrawBitmapString("shape is: " + msg_string, ofGetWidth()-100,20);
}

void ofApp::keyPressed(int key){
    if(key == 'c') {
        features.clear();
    }
    if(key == 'r') {
        mRecord = !mRecord;
    }
}
void ofApp::keyReleased(int key){}
void ofApp::mouseMoved(int x, int y ){}
void ofApp::mouseDragged(int x, int y, int button){
    cPos = ofVec2f(x,y);
}

void ofApp::mousePressed(int x, int y, int button){
    cPos = ofVec2f(x,y);
    pPos = cPos;
    mDrawing = true;
    features.push_back(FeatureSet());
}

void ofApp::mouseReleased(int x, int y, int button){
    mDrawing = false;
    pPos = cPos;
    
    if(mRecord) {
        msg.clear();
        msg.setAddress(oscControlStart);
        sender.sendMessage(msg);
    }
    
    msg.clear();
    msg.setAddress(oscInputAddress);
    for (int i=0; i<features[features.size()-1].ang.size(); i++) {
        msg.addFloatArg(features[features.size()-1].ang[i]);
    }
    
    if(features[features.size()-1].ang.size()<numFeatures) {
        for(int i=0; i< numFeatures - features[features.size()-1].ang.size(); i++) {
            msg.addFloatArg(0);
        }
    }
    
     for (int i=0; i<features[features.size()-1].vel.size(); i++) {
        msg.addFloatArg(features[features.size()-1].vel[i]);
    }
    
    if(features[features.size()-1].vel.size()<numFeatures) {
        for(int i=0; i< numFeatures - features[features.size()-1].vel.size(); i++) {
            msg.addFloatArg(0);
        }
    }
    
    sender.sendMessage(msg);
    
    if(mRecord) {
        msg.clear();
        msg.setAddress(oscControlStop);
        sender.sendMessage(msg);
    }
}

void ofApp::mouseEntered(int x, int y){}
void ofApp::mouseExited(int x, int y){}
void ofApp::windowResized(int w, int h){}
void ofApp::gotMessage(ofMessage msg){}
void ofApp::dragEvent(ofDragInfo dragInfo){}
