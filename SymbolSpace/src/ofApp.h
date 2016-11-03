#pragma once

#include "ofMain.h"
#include "ofxLeapMotion2.h"
#include "ofxSodaLib.h"
#include "ofxOsc.h"
#include "Button.h"
#include "Speech.h"

class ofApp : public ofBaseApp {
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
    
    // Leap Motion
	ofxLeapMotion leap;
	vector <ofxLeapMotionSimpleHand> simpleHands;
	vector <int> fingersFound;
	ofEasyCam cam;
    ofFbo leapView;
    
    // Video background
    ofVideoGrabber vidGrabber;
    ofPixels videoPixels;
    ofTexture videoTexture;
    int camWidth;
    int camHeight;
    
    // UI
    Button * bTrain;
    Button * bRun;
    Button * bRecord;
    Button * bStopRecord;
    
    ofTrueTypeFont mTextFontSmall, mTextFontLarge;
    vector < ofImage > imgClasses;
    
    // received from wekinator
    float mTrackingResult = 0;
    int mClassificationResult = 0;
    
    bool mPlaySpeech = false;
    vector < Speech *> speeches;
    
    // sent to wekinator
    vector< float > features;
    
    // OSC in / out
    string oscHost, oscInputAddress;
    string oscStartRecording, oscStopRecording, oscStartTraining, oscStartRunning, oscStopRunning;
    
    int oscSendingPort;
    int oscReceivingPort;
    
    void sendOSC();
    void receiveOSC();
    
    ofxOscSender sender;
    ofxOscReceiver receiver;
    ofxOscMessage msg;
    string receiveString;

    // sound related (using SodaLib)
    ofxSodaLib soda;
    void audioReceived(float * input, int bufferSize, int nChannels);
    void audioRequested(float * output, int bufferSize, int nChannels);
};
