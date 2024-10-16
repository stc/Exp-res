#pragma once

#include "ofMain.h"
#include "ofEvents.h"
#include "ofxSocketIO.h"
#include "ofxSocketIOData.h"
#include "ofxJSON.h"
//#include "ofxPd.h"
#include "DataPoint.h"

//using namespace pd;

//class ofApp : public ofBaseApp, public PdReceiver, public PdMidiReceiver {
class ofApp : public ofBaseApp {
public:
    void setup();
    void update();
    void draw();
    void exit();

    void keyPressed(int key);
    void keyReleased(int key);
    void mouseMoved(int x, int y );
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void mouseEntered(int x, int y);
    void mouseExited(int x, int y);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);
    
    void gotEvent(string& name);
    void onServerEvent(ofxSocketIOData& data);
    
    ofxSocketIO socketIO;
    void initSocketIO();
    
    bool isConnected;
    void onConnection();
    void bindEvents();
    
    ofEvent<ofxSocketIOData&> serverEvent;
    
    string address;
    string status;
    
    string searchPhrase;
    vector< DataPoint * > datapoints;
    void saveDataPoints();
    
    int tCount = 0;
    int ptCount = 0;
    float avgMood = 0;
    float cScore = 0;
    float cComp = 0;
    int dSize = 5;
    
    int startTime;
    void metro(int maxTime);
    int cTweet = 0;
    
    ofTrueTypeFont titleFont;
    ofTrueTypeFont textFont;
    
    ofxJSONElement mExport;
    
    //ofxPd pd;
    void print(const std::string& message);
    void audioReceived(float * input, int bufferSize, int nChannels);
    void audioRequested(float * output, int bufferSize, int nChannels);
};
