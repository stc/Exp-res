#include "ofApp.h"

void ofApp::setup(){
    //ofSetBackgroundAuto(false);
    ofBackground(230);
    searchPhrase = "dead";
    
    titleFont.load("lekton/Lekton-Italic.ttf", 60);
    headingFont.load("lekton/Lekton-Italic.ttf", 30);
    textFont.load("lekton/Lekton-Regular.ttf", 20);

    gui.setup();
    gui.add(scale.set("scale", 0.014, 0.0, 0.1));
}

void ofApp::update(){
    tsnePoints = tsne.iterate();
    for (int i=0; i<testPoints.size(); i++) {
        testPoints[i].tsnePoint = ofPoint(tsnePoints[i][0], tsnePoints[i][1]);
    }
}

void ofApp::draw(){
    ofPushMatrix();
    ofTranslate(-ofGetWidth() * (scale - 0.5), -ofGetHeight() * (scale - 0.5));
    for (int i=0; i<testPoints.size(); i++) {
        if(i<datapoints.size()) {
            float x = ofMap(testPoints[i].tsnePoint.x, 0, 1, 0, scale * ofGetWidth());
            float y = ofMap(testPoints[i].tsnePoint.y, 0, 1, 0, scale * ofGetHeight());
            datapoints[i]->mPos = ofPoint(x,y);
            
        }
    }
    
    ofMesh rawMesh;
    for (int i=0; i<datapoints.size();i++) {
        rawMesh.addVertex(ofVec3f(datapoints[i]->mPos.x, datapoints[i]->mPos.y,0));
    }
    
    ofMesh connectionMesh;
    connectionMesh.setMode( OF_PRIMITIVE_LINES );
    
    float connectionDistance = 100;
    int numVerts = datapoints.size();
    
    
        for (int a=0; a<numVerts; ++a) {
            ofVec3f verta = rawMesh.getVertex(a);
            for (int b=a+1; b<numVerts; ++b) {
                ofVec3f vertb = rawMesh.getVertex(b);
                float distance = verta.distance(vertb);
                if (distance <= connectionDistance) {
                    //float alphaVal = ofMap(distance, 0, connectionDistance, 255,0);
                    ofColor c = ofColor(datapoints[a]->c, 5);
                    connectionMesh.addColor(c);
                    connectionMesh.addVertex(verta);
                    connectionMesh.addColor(c);
                    connectionMesh.addVertex(vertb);
                }
            }
        }
        connectionMesh.draw();

    
    for(auto dp : datapoints) {
        dp->drawBg();
    }
    
    for(auto dp : datapoints) {
        dp->draw();
    }
    ofPopMatrix();
    
    ofSetColor(255);
    titleFont.drawString(searchPhrase, 50, 100);
    ofDrawLine(50,130,ofGetWidth()-50,130);
    ofColor c;
    
    if(avgMood>2) {
        c = ofColor(75,162,205);
    } else if(avgMood<=2 && avgMood>1) {
        c= ofColor(88,142,163);
    } else if(avgMood<-1 && avgMood >=-2) {
        c = ofColor(160,89,38);
    } else if(avgMood < -2) {
        c = ofColor(205,90,6);
    } else {
        c = ofColor(100);
    }
    ofSetColor(c);
    headingFont.drawString("average mood: " + ofToString(avgMood), 50, 180);
    ofSetColor(75,162,205);
    ofDrawRectangle(50,220,20,20);
    ofSetColor(100,150);
    textFont.drawString("very positive", 80, 235);
    ofSetColor(88,142,163);
    ofDrawRectangle(50,260,20,20);
    ofSetColor(100,150);
    textFont.drawString("positive", 80, 275);
    ofSetColor(100);
    ofDrawRectangle(50,300,20,20);
    ofSetColor(100,150);
    textFont.drawString("neutral", 80, 315);
    ofSetColor(160,89,38);
    ofDrawRectangle(50,340,20,20);
    ofSetColor(100,150);
    textFont.drawString("negative", 80, 355);
    ofSetColor(205,90,6);
    ofDrawRectangle(50,380,20,20);
    ofSetColor(100,150);
    textFont.drawString("very negative", 80, 395);
}

void ofApp::loadData() {
    datapoints.clear();
    ofxJSONElement dp;
    bool parsingSuccessful = dp.open(ofToDataPath(searchPhrase +".json"));
    if (parsingSuccessful) {
        for (Json::ArrayIndex i = 0; i < dp.size(); ++i){
            datapoints.push_back(new DataPoint(dp[i]["date"].asString(),dp[i]["text"].asString(),dp[i]["score"].asInt(),dp[i]["comp"].asFloat()));
        }
    }else {
        ofLogError("Failed to parse JSON file of positions");
    }
    float sum;
    for(auto dp : datapoints) {
        sum += dp->mScore;
    }
    avgMood = sum/datapoints.size();
}

void ofApp::calcTSNE() {
    testPoints.clear();
    for(int i=0; i<datapoints.size(); i++) {
        TestPoint testPoint;
        vector<float> point;
        point.resize(2);
        point[0] = datapoints[i]->mScore;
        point[1] = datapoints[i]->mComp;
        
        testPoint.point = point;
        testPoints.push_back(testPoint);
    }
    vector< vector<float> > data;
    for (int i = 0; i < testPoints.size(); i++) {
        data.push_back(testPoints[i].point);
    }
    
    int dims = 2;
    float perplexity = 35;
    float theta = 0.66;
    bool normalize = false;
    
    tsnePoints = tsne.run(data, dims, perplexity, theta, normalize, true);
}

void ofApp::keyPressed(int key){
    if(key == 'l') {
        loadData();
    }
    if(key == 't') {
        calcTSNE();
    }
}
void ofApp::keyReleased(int key){}
void ofApp::mouseMoved(int x, int y ){}
void ofApp::mouseDragged(int x, int y, int button){}
void ofApp::mousePressed(int x, int y, int button){}
void ofApp::mouseReleased(int x, int y, int button){}
void ofApp::mouseEntered(int x, int y){}
void ofApp::mouseExited(int x, int y){}
void ofApp::windowResized(int w, int h){}
void ofApp::gotMessage(ofMessage msg){}
void ofApp::dragEvent(ofDragInfo dragInfo){}
