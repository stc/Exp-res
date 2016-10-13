#include "FeatureSet.h"

void FeatureSet::addDataPoint(ofVec2f position, float velocity, float angle) {
    vel.push_back(velocity);
    ang.push_back(angle);
    pos.push_back(position);
}

void FeatureSet::drawDataPoints() {
    ofSetColor(255,160);
    for(int i=0; i<pos.size()-1; i++) {
        ofDrawLine(pos[i],pos[i+1]);
    }
    ofSetColor(255,80);
    for(auto p : pos) {
        ofDrawCircle(p,2);
    }
}

void FeatureSet::drawFeatures(ofVec2f p) {
    ofPushMatrix();
    ofTranslate(p);
    ofSetColor(255,100);
    ofDrawLine(0,0,220,0);
    ofDrawLine(0,h,220,h);
    
    ofSetColor(255,100,100,100);
    ofDrawBitmapString("velocity",5,12);
    for(int i=0; i< vel.size()-1; i++) {
        ofDrawLine(i+100,h-vel[i],i+1+100,h-vel[i+1]);
    }
    
    ofSetColor(100,100,255,100);
    ofDrawBitmapString("angle",5,24);
    for(int i=0; i< ang.size()-1; i++) {
        ofDrawLine(i+100,ofMap(ang[i],-180,180,0,h),i+1+100,ofMap(ang[i+1],-180,180,0,h));
    }
    ofPopMatrix();
}
