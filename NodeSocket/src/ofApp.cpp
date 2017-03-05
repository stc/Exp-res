#include "ofApp.h"

void ofApp::setup(){
    // sound
    int ticksPerBuffer = 8;
    int numInputs = 2;
    ofSoundStreamSetup(2, numInputs, this, 44100, ofxPd::blockSize()*ticksPerBuffer, 3);
    
    if(!pd.init(2, numInputs, 44100, ticksPerBuffer, false)) {
        OF_EXIT_APP(1);
    }
    
    pd.start();
    pd.addReceiver(*this);
    Patch patch = pd.openPatch("pd/main.pd");

    // socket.io
    //initSocketIO();
    
    // gfx
    titleFont.load("lekton/Lekton-Italic.ttf", 36);
    textFont.load("lekton/Lekton-Regular.ttf", 10);
    
    startTime = ofGetElapsedTimeMillis();
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

void ofApp::initSocketIO() {
    isConnected = false;
    address = "https://127.0.0.1:8080";
    status = "not connected";
    
    searchPhrase = "pleasure";
    
    std::map<std::string,std::string> query;
    query["phrase"] = searchPhrase;
    socketIO.setup(address, query);
    
    ofAddListener(socketIO.notifyEvent, this, &ofApp::gotEvent);
    ofAddListener(socketIO.connectionEvent, this, &ofApp::onConnection);
}

void ofApp::update(){
    metro(5000);
}

void ofApp::draw(){
    ofBackground(240);
    
    ofSetColor(30);
    titleFont.drawString(searchPhrase,20,50);
    ofSetColor(30,50);
    ofDrawLine(0,ofGetHeight()/2,ofGetWidth(),ofGetHeight()/2);
    
    float sum = 0;
    for(auto dp : datapoints) {
        dp->draw();
        sum+=dp->mMood;
    }
    
    if(cTweet<datapoints.size()) {
        datapoints[cTweet]->drawContent();
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
    
    if(ptCount!=tCount) {
        pd.sendFloat("tweet-trigger",cMood);
        pd.sendFloat("tweet-average",avgMood);
    }
    ptCount = tCount;
    
}

void ofApp::onServerEvent(ofxSocketIOData& data) {
    tCount++;
    datapoints.push_back(new DataPoint(data.getStringValue("tText"), data.getStringValue("tDate"), data.getFloatValue("tMood"), ofVec2f(tCount * dSize, ofGetHeight() / 2), dSize, textFont));
    cMood = data.getFloatValue("tMood");
}

void ofApp::gotEvent(string& name) {
    status = name;
}

void ofApp::metro(int maxTime) {
    int elapsed = ofGetElapsedTimeMillis() - startTime;
    if (elapsed > maxTime) {
        startTime = ofGetElapsedTimeMillis();
        cTweet = int( ofClamp( ofRandom(datapoints.size() ),0,200) );
    }
}

void ofApp::exit() {
    string s = "stopStream";
    socketIO.emit(s);
    pd.stop();
}

void ofApp::print(const std::string& message) {
    cout << message << endl;
}

void ofApp::audioReceived(float * input, int bufferSize, int nChannels) {
    pd.audioIn(input, bufferSize, nChannels);
}

void ofApp::audioRequested(float * output, int bufferSize, int nChannels) {
    pd.audioOut(output, bufferSize, nChannels);
}

void ofApp::keyPressed(int key){
    if(key == ' ') {
        initSocketIO();
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
