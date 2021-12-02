#pragma once
#include "ofMain.h"

class Node {
public:
    Node(int id, int pitch);
    void update();
    void draw();
    
    int mId;
    int mPitch;
    ofVec2f mPos;
    ofVec2f mForce;
    float mMass;
    
    bool isSimilar(Node * n);
};
