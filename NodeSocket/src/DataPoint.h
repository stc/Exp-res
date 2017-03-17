#pragma once
#include "ofMain.h"

class DataPoint {
public:
    string mText;
    string mDate;
    float mScore = 0;
    float mComp = 0;
    ofVec2f mPos;
    int mSize;
    int mRange = 20;
    ofTrueTypeFont mFont;
    
    DataPoint( string text, string date, float score, float comp, ofVec2f pos, int size, ofTrueTypeFont & font ) {
        mText = text;
        mDate = date;
        mScore = score;
        mComp = comp;
        mSize = size;
        mPos  = ofVec2f(pos.x,pos.y - ofClamp(mScore * 30,-200,200) );
        mFont = font;
    }
    
    void draw() {
        if(mScore>2) {
            ofSetColor(75,162,205,100);
        } else if(mScore < -2) {
            ofSetColor(205,90,6,100);
        } else {
            ofSetColor(30,100);
        }
        ofDrawLine(mPos.x,mPos.y,mPos.x,ofGetHeight()/2);
        
        ofSetColor(30);
        ofDrawCircle(mPos, mSize / 2);
    }
    
    void drawContent() {
            ofSetColor(240);
            ofDrawRectangle(0,80,ofGetWidth(),40);
            ofSetColor(30);
            mFont.drawString(ofSplitString(mText,"\n")[0], 20, 100);
            ofNoFill();
            ofSetColor(30,50);
            ofDrawLine(mPos.x, 180,ofGetWidth()/2,140);
            ofDrawLine(mPos.x, 180,mPos.x,mPos.y);
            ofDrawLine(ofGetWidth()/2,110, ofGetWidth()/2,140);
            ofDrawLine(0,110,ofGetWidth(),110);
            ofDrawCircle(mPos, mSize * 2);
    }
    
    bool over( ofVec2f cursor ) {
        return cursor.distance(mPos) < mSize;
    }
};
