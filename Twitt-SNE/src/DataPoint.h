#pragma once

class DataPoint {
public:
    string mDate;
    string mText;
    int mScore;
    float mComp;
    ofPoint mPos;
    float mAge = 0;
    ofColor c;
    
    DataPoint(string date, string text, int score, float comp) {
        mDate = date;
        mText = text;
        mScore = score + ofRandom(10000) / 10000.0;
        mComp = comp;
        
        
        if(mScore>2) {
            c = ofColor(75,162,205);
        } else if(mScore<=2 && mScore>1) {
            c= ofColor(88,142,163);
        } else if(mScore<-1 && mScore >=-2) {
            c = ofColor(160,89,38);
        } else if(mScore < -2) {
            c = ofColor(205,90,6);
        } else {
            c = ofColor(100);
        }
    }
    void drawBg() {
        ofSetColor(c,10);
        ofDrawLine(0,0,mPos.x,mPos.y);
        ofSetColor(c,1);
        ofSetCircleResolution(100);
        ofDrawCircle(mPos,400);
    }
    void draw() {
        //ofSetColor(255,20);
        //ofDrawCircle(mPos,20);
        ofSetColor(c,255);
        ofDrawCircle(mPos,2);
        mAge+=0.1;
    }
};
