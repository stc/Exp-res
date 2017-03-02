#pragma once

#include "ofMain.h"
#include "ofEvents.h"
#include "ofxSocketIO.h"
#include "ofxSocketIOData.h"
#include "DataPoint.h"

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
    void onPingEvent(ofxSocketIOData& data);
    void onNSPingEvent(ofxSocketIOData& data);
    
    ofxSocketIO socketIO;
    
    bool isConnected;
    void onConnection();
    void bindEvents();
    
    ofEvent<ofxSocketIOData&> serverEvent;
    
    string address;
    string status;
    
    string searchPhrase;
    vector< DataPoint * > datapoints;
    
    int tCount = 0;
    float avgMood = 0;
    int dSize = 5;
};
