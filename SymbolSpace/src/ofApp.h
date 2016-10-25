#pragma once

#include "ofMain.h"
#include "ofxLeapMotion2.h"
#include "ofxSodaLib.h"
#include "ofxOsc.h"

class ofApp : public ofBaseApp{
    
public:
    void setup();
    void update();
    void draw();
	
    void keyPressed  (int key);
    void keyReleased(int key);
    void mouseMoved(int x, int y );
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);
    void exit();
    
    void drawLeapView(int left, int top);
    
	ofxLeapMotion leap;
	vector <ofxLeapMotionSimpleHand> simpleHands;
    
	vector <int> fingersFound;
	ofEasyCam cam;
    
    ofFbo leapView;
    
    ofVideoGrabber vidGrabber;
    ofPixels videoPixels;
    ofTexture videoTexture;
    int camWidth;
    int camHeight;

    ofxSodaLib soda;
    void audioReceived(float * input, int bufferSize, int nChannels);
    void audioRequested(float * output, int bufferSize, int nChannels);
};
