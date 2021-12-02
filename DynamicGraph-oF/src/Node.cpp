#include "Node.h"

Node::Node(int id, int pitch) {
    mId = id;
    mPitch = pitch;
    mPos = ofVec2f( ofRandom( -ofGetWidth()/2, ofGetWidth() ), ofRandom( -ofGetHeight()/2, ofGetHeight()) );
    mForce = ofVec2f( 0, 0 );
    mMass = ofRandom(10,20);
}

void Node::update() {
    ofVec2f force = ofVec2f(mForce.x, mForce.y);
    ofVec2f vel = ofVec2f(force.x, force.y) / mMass;
    mPos += vel;
}

void Node::draw() {
    ofSetColor(255);
    ofFill();
    ofDrawCircle(mPos, mMass/5);
}

bool Node::isSimilar(Node * n) {
    if (mPitch == n->mPitch) {
        return true;
      } else {
        return false;
      }
}
