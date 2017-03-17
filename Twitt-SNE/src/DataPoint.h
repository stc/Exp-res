#pragma once

class DataPoint {
public:
    string mDate;
    string mText;
    int mScore;
    float mComp;
    ofPoint mPos;
    float mAge = 0;
    
    DataPoint(string date, string text, int score, float comp) {
        mDate = date;
        mText = text;
        mScore = score;
        mComp = comp;
    }
    
    void draw() {
        ofColor c;
        c.setHsb(ofMap(mScore,-10,10,255,155), 200, 40);
        ofSetColor(c, mAge);
        ofDrawCircle(mPos,2);
        mAge+=0.01;
    }
};
