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
        mScore = score;
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
    
    void draw() {
        ofSetColor(200,5);
        ofDrawCircle(mPos,8);
        ofSetColor(c,mAge);
        ofDrawCircle(mPos,3);
        mAge+=0.1;
    }
};
