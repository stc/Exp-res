#pragma once
#include "ofMain.h"

class Speech {
public:
    bool mCanPlay = true;
    float mPos; // 0 - 1
    
    Speech(float pos) {
        mPos = pos;
    }
    bool play(float value) {
        if(ofVec2f(value,0).distance(ofVec2f(mPos,0)) < 0.05) {
            if(mCanPlay) {
                mCanPlay = false;
                return true;
            } else {
                return false;
            }
            
        } else {
            mCanPlay = true;
            return false;
        }
    }
};
