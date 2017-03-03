#pragma once
#include "ofMain.h"

class DataPoint {
public:
    string mText;
    string mDate;
    float mMood = 0;
    ofVec2f mPos;
    int mSize;
    int mRange = 20;
    ofTrueTypeFont mFont;
    
    DataPoint( string text, string date, float mood, ofVec2f pos, int size, ofTrueTypeFont & font ) {
        mText = text;
        mDate = date;
        mMood = mood;
        mSize = size;
        mPos  = ofVec2f(pos.x,pos.y - ofClamp(mMood * 30,-200,200) );
        mFont = font;
    }
    
    void draw( ofVec2f cursor ) {
        if(mMood>2) {
            ofSetColor(75,162,205,100);
        } else if(mMood < -2) {
            ofSetColor(205,90,6,100);
        } else {
            ofSetColor(30,100);
        }
        ofDrawLine(mPos.x,mPos.y,mPos.x,ofGetHeight()/2);
        
        ofSetColor(30);
        ofDrawCircle(mPos, mSize / 2);
        if(over(cursor)) {
            ofSetColor(240);
            ofDrawRectangle(0,80,ofGetWidth(),40);
            ofSetColor(30);
            mFont.drawString(ofSplitString(mText,"\n")[0], 20, 100);
        }
    }
    
    bool over( ofVec2f cursor ) {
        return cursor.distance(mPos) < mSize;
    }
};
