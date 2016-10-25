#pragma once
#include "ofMain.h"
#include "ofxFontStash.h"

class Button {
public:
    ofVec2f mPos;
    ofVec2f mCenter;
    int mSize;
    string mName;
    ofxFontStash mTextFont;
    string mType;
    
    
    Button(string name, ofVec2f pos, int size, ofxFontStash & textFont) {
        mPos = pos;
        mSize = size;
        mCenter = ofVec2f(mPos.x + mSize / 2, mPos.y + mSize/2);
        mName = name;
        mTextFont = textFont;
    }
    
    void draw() {
        ofNoFill();
        ofSetColor(255,200);
        ofDrawCircle(mPos.x+mSize/2,mPos.y+mSize/2, mSize/2);
        ofFill();
        mTextFont.draw(mName,16,mPos.x+mSize/4, mPos.y+mSize/1.8);
    }
    
    string over(ofVec2f cur) {
        if(cur.distance(mCenter) < mSize / 2) {
            return mName;
        } else {
            return "";
        }
    }
};
