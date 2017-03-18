#pragma once

#include "ofMain.h"
#include "ofxJSON.h"
#include "ofxTSNE.h"
#include "ofxGui.h"
#include "DataPoint.h"

class ofApp : public ofBaseApp{
public:
    void setup();
    void update();
    void draw();

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
    
    ofxJSONElement mJsonData;
    vector< DataPoint * > datapoints;
    void loadData();
    
    struct TestPoint {
        vector<float> point;
        ofPoint tsnePoint;
    };

    ofxTSNE tsne;
    vector<TestPoint> testPoints;
    vector<vector<double> > tsnePoints;
    void calcTSNE();
    
    ofxPanel gui;
    ofParameter<float> scale;
    ofParameter<float> nodeSize;
    
    string searchPhrase;
    float avgMood;
    ofTrueTypeFont titleFont;
    ofTrueTypeFont headingFont;
    ofTrueTypeFont textFont;
};
