#pragma once 
#include "ofMain.h"

class FeatureSet {
public:
    void addDataPoint(ofVec2f position, float velocity, float angle);
    void drawDataPoints();
    void drawFeatures(ofVec2f p);
    
    vector< ofVec2f > pos;
    vector< float > vel;
    vector< float > ang;
    
    int h = 50;
};
