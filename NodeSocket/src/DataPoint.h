#pragma once
#include "ofMain.h"

class DataPoint {
public:
    string mText;
    string mDate;
    float mMood;
    ofVec2f mPos;
    int mSize;
    int mRange = 20;
    
    DataPoint( string text, string date, float mood, ofVec2f pos, int size ) {
        mText = text;
        mDate = date;
        mMood = mood;
        mSize = size;
        mPos  = ofVec2f(pos.x,pos.y - mMood * 30);
    }
    
    void draw( ofVec2f cursor ) {
        ofSetColor(255,100);
        ofDrawLine(mPos.x,mPos.y,mPos.x,ofGetHeight()/2);
        ofSetColor(255);
        ofDrawCircle(mPos, mSize / 2);
        if(over(cursor)) {
            ofDrawBitmapStringHighlight(mText, 20, 100);
        }
    }
    
    bool over( ofVec2f cursor ) {
        return cursor.distance(mPos) < mSize;
    }
};
