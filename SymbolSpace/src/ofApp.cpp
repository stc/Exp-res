#include "ofApp.h"

void ofApp::setup(){
    int ticksPerBuffer = 8; // 8 * 64 = buffer len of 512
    ofSoundStreamSetup(2, 2, this, 44100, ofxPd::blockSize()*ticksPerBuffer, 3);
    ofSetCircleResolution(120);
    
    // give absolute paths to soundfiles
    string path = "sounds";
    ofDirectory dir(path);
    string absPath = dir.getAbsolutePath();
    
    soda.init();
    //soda.createFreezer("scale-0",absPath + "/flute_d.wav");
    //soda.createFreezer("scale-1",absPath + "/flute_e.wav");
    //soda.createFreezer("scale-2",absPath + "/flute_g.wav");
    //soda.createFreezer("scale-3",absPath + "/flute_a.wav");
    
    if(mPlaySpeech) {
    soda.createSampler("speech0", absPath + "/toop_01.wav", 1);
    soda.createSampler("speech1", absPath + "/toop_02.wav", 1);
    soda.createSampler("speech2", absPath + "/toop_03.wav", 1);
    soda.createSampler("speech3", absPath + "/toop_04.wav", 1);
    soda.createSampler("speech4", absPath + "/toop_05.wav", 1);
    soda.createSampler("speech5", absPath + "/toop_06.wav", 1);
    soda.createSampler("speech6", absPath + "/toop_07.wav", 1);
    soda.createSampler("speech7", absPath + "/toop_08.wav", 1);
    soda.createSampler("speech8", absPath + "/toop_09.wav", 1);
    soda.createSampler("speech9", absPath + "/toop_10.wav", 1);
    soda.createSampler("speech10", absPath + "/toop_11.wav", 1);
    soda.createSampler("speech11", absPath + "/toop_12.wav", 1);
    soda.createSampler("speech12", absPath + "/toop_13.wav", 1);
    soda.createSampler("speech13", absPath + "/toop_14.wav", 1);
    soda.createSampler("speech14", absPath + "/toop_15.wav", 1);
    soda.createSampler("speech15", absPath + "/toop_16.wav", 1);
    }
    speeches.push_back(new Speech(0.2));
    speeches.push_back(new Speech(0.4));
    speeches.push_back(new Speech(0.6));
    speeches.push_back(new Speech(0.8));

    speeches.push_back(new Speech(0.2));
    speeches.push_back(new Speech(0.4));
    speeches.push_back(new Speech(0.6));
    speeches.push_back(new Speech(0.8));

    speeches.push_back(new Speech(0.2));
    speeches.push_back(new Speech(0.4));
    speeches.push_back(new Speech(0.6));
    speeches.push_back(new Speech(0.8));
    
    speeches.push_back(new Speech(0.2));
    speeches.push_back(new Speech(0.4));
    speeches.push_back(new Speech(0.6));
    speeches.push_back(new Speech(0.8));

    ofSetFrameRate(60);
    ofSetVerticalSync(true);
	
    // we have 18 features from leap
    for(int i=0; i<36; i++) features.push_back(0);
    
	leap.open();
    
    leapView.allocate(300, 200, GL_RGBA);
    leapView.begin();
    ofClear(255,255,255, 0);
    leapView.end();
	cam.setOrientation(ofPoint(-20, 0, 0));
	
    camWidth = 640;  // try to grab at this size.
    camHeight = 480;
    
    vector<ofVideoDevice> devices = vidGrabber.listDevices();
    
    for(int i = 0; i < devices.size(); i++){
        if(devices[i].bAvailable){
            ofLogNotice() << devices[i].id << ": " << devices[i].deviceName;
        }else{
            ofLogNotice() << devices[i].id << ": " << devices[i].deviceName << " - unavailable ";
        }
    }
    
    vidGrabber.setDeviceID(0);
    vidGrabber.setDesiredFrameRate(60);
    vidGrabber.initGrabber(camWidth, camHeight);
    
    videoPixels.allocate(camWidth, camHeight, OF_PIXELS_RGB);
    videoTexture.allocate(videoPixels);
    
    ofImage img;
    img.load("assets/symbol_001.png");
    imgClasses.push_back(img);
    img.clear();
    img.load("assets/symbol_002.png");
    imgClasses.push_back(img);
    img.clear();
    img.load("assets/symbol_003.png");
    imgClasses.push_back(img);
    img.clear();
    img.load("assets/symbol_004.png");
    imgClasses.push_back(img);
    img.clear();
    img.load("assets/symbol_005.png");
    imgClasses.push_back(img);
    
    mTextFontSmall.load("assets/Quicksand-Bold.ttf", 10);
    mTextFontLarge.load("assets/Quicksand-Regular.ttf", 12);
    bRun = new Button("RUN", ofVec2f(ofGetWidth()/2 - 2 * ofGetHeight()/10,ofGetHeight()-ofGetHeight()/5), ofGetHeight()/10, mTextFontLarge);
    bTrain = new Button("TRAIN", ofVec2f(ofGetWidth()/2 - ofGetHeight()/20,ofGetHeight()-ofGetHeight()/5), ofGetHeight()/10, mTextFontLarge);
    bRecord = new Button("RECORD", ofVec2f(ofGetWidth()-ofGetWidth()/3, ofGetHeight()-ofGetHeight()/5), ofGetHeight()/10, mTextFontLarge);
    bStopRecord = new Button("STOP", ofVec2f(ofGetWidth()-ofGetWidth()/3 + ofGetHeight()/10 + ofGetHeight()/8, ofGetHeight()-ofGetHeight()/5), ofGetHeight()/10, mTextFontLarge);
    
    oscSendingPort = 6448;
    oscInputAddress = "/wek/inputs";
    oscStartRecording = "/wekinator/control/startRecording";
    oscStopRecording = "/wekinator/control/stopRecording";
    oscStartRunning = "/wekinator/control/startRunning";
    oscStopRunning = "/wekinator/control/stopRunning";
    oscStartTraining = "/wekinator/control/train";
    
    oscHost = "localhost";
    sender.setup(oscHost, oscSendingPort);
    oscReceivingPort = 12000;
    receiver.setup(oscReceivingPort);
}

void ofApp::update(){
    vidGrabber.update();
    
    ofPixels & pixels = vidGrabber.getPixels();
    for(int i = 0; i < pixels.size(); i++){
        videoPixels[i] = pixels[i];
    }
    
    for (int i = 0; i < videoPixels.size(); i+=3){
        int r = videoPixels[i+0], g = videoPixels[i+1], b = videoPixels[i+2];
        unsigned char avg = (r + g + b) / 3;
        videoPixels[i+0] = avg * 0.5;
        videoPixels[i+1] = avg * 0.5;
        videoPixels[i+2] = avg * 0.5;
    }  

    videoTexture.loadData(videoPixels);

	fingersFound.clear();
	
	simpleHands = leap.getSimpleHands();
    if( leap.isFrameNew() && simpleHands.size() ){
        
        leap.setMappingX(-230, 230, -leapView.getWidth()/2, leapView.getWidth()/2);
		leap.setMappingY(90, 490, -leapView.getHeight()/2, leapView.getHeight()/2);
        leap.setMappingZ(-150, 150, -200, 200);
        
        fingerType fingerTypes[] = {THUMB, INDEX, MIDDLE, RING, PINKY};
        
        
        for(int i = 0; i < simpleHands.size(); i++){
            for (int f=0; f<5; f++) {
                int id = simpleHands[i].fingers[ fingerTypes[f] ].id;
                ofPoint mcp = simpleHands[i].fingers[ fingerTypes[f] ].mcp; // metacarpal
                ofPoint pip = simpleHands[i].fingers[ fingerTypes[f] ].pip; // proximal
                ofPoint dip = simpleHands[i].fingers[ fingerTypes[f] ].dip; // distal
                ofPoint tip = simpleHands[i].fingers[ fingerTypes[f] ].tip; // fingertip
                fingersFound.push_back(id);
            }
        }
    }
    leap.markFrameAsOld();
    receiveOSC();
}

void ofApp::draw(){
    ofBackgroundGradient(ofColor(0), ofColor(30, 30, 30),  OF_GRADIENT_BAR);
    ofPushMatrix();
    ofSetRectMode( OF_RECTMODE_CENTER );
    ofTranslate( ofGetWidth()/2, ofGetHeight()/2, 0 );
    ofScale( -1, 1, 1 );
    videoTexture.draw(0, 0, ofGetWidth(), ofGetHeight());
    ofSetRectMode( OF_RECTMODE_CORNER );
    ofPopMatrix();
    
    ofSetColor(255);
	mTextFontSmall.drawString("Leap connected: " + ofToString(leap.isConnected()),20, 20);
    mTextFontSmall.drawString("Current Symbol (classification):",20, 40);
    mTextFontSmall.drawString("Current position (classification):", ofGetWidth()/3, 40);
    mTextFontSmall.drawString("States", ofGetWidth()/2 - 2 * ofGetHeight()/10, ofGetHeight()-ofGetHeight()/4);
    mTextFontSmall.drawString("Record Features", ofGetWidth()-ofGetWidth()/3, ofGetHeight()-ofGetHeight()/4);
    
    imgClasses[mClassificationResult].draw(20, 60, 200, 100);
    
    ofSetColor(255,100);
    ofDrawLine(ofGetWidth()/3, 150, ofGetWidth()/3 + ofGetWidth()/3, 150);
    ofSetColor(255);
    ofDrawCircle(ofGetWidth()/3 + ofMap(mTrackingResult,0,1,0, ofGetWidth()/3), 150, 10);
    
    ofSetColor(255);
    ofDrawLine(ofGetWidth()/2 - 2 * ofGetHeight()/10,ofGetHeight()-ofGetHeight()/4.5, ofGetWidth(), ofGetHeight()-ofGetHeight()/4.5);
    ofDrawRectangle(19,ofGetHeight()-221,302,202);
    ofSetColor(255);
    drawLeapView(20,ofGetHeight()-220);
    
    bTrain->draw();
    bRun->draw();
    bRecord->draw();
    bStopRecord->draw();
    
    if(ofGetFrameNum()%3 ==0) {
        sendOSC();
    }
}

void ofApp::drawLeapView(int left, int top) {
    leapView.begin();
    cam.begin();
    ofBackground(0);
    ofPushMatrix();
    ofRotate(90, 0, 0, 1);
    ofSetColor(120,100);
    ofDrawGridPlane(800, 20, false);
    ofPopMatrix();
    
    fingerType fingerTypes[] = {THUMB, INDEX, MIDDLE, RING, PINKY};
    
    for(int i = 0; i < simpleHands.size(); i++){
        bool isLeft        = simpleHands[i].isLeft;
        ofPoint handPos    = simpleHands[i].handPos;
        ofPoint handNormal = simpleHands[i].handNormal;
        
        ofSetColor(255,100);
        ofDrawSphere(handPos.x, handPos.y, handPos.z, 10);
        ofSetColor(255, 100);
        ofDrawArrow(handPos, handPos + 100*handNormal);
        
        for (int f=0; f<5; f++) {
            ofPoint mcp = simpleHands[i].fingers[ fingerTypes[f] ].mcp;  // metacarpal
            ofPoint pip = simpleHands[i].fingers[ fingerTypes[f] ].pip;  // proximal
            ofPoint dip = simpleHands[i].fingers[ fingerTypes[f] ].dip;  // distal
            ofPoint tip = simpleHands[i].fingers[ fingerTypes[f] ].tip;  // fingertip
            
            ofSetColor(255);
            ofDrawSphere(mcp.x, mcp.y, mcp.z, 4);
            ofDrawSphere(pip.x, pip.y, pip.z, 4);
            ofDrawSphere(dip.x, dip.y, dip.z, 4);
            ofDrawSphere(tip.x, tip.y, tip.z, 4);
            
            // extract feature from left hand only
            // for now, extracting thumb, index & pinky, tip & metacarpal data only
            // since they make more sense in our feature space
            
            if(simpleHands[i].isLeft) {
                switch (f) {
                    case 0:
                        features[0] = tip.x;
                        features[1] = tip.y;
                        features[2] = tip.z;
                        features[3] = mcp.x;
                        features[4] = mcp.y;
                        features[5] = mcp.z;
                        break;
                    case 1:
                        features[6]  = tip.x;
                        features[7]  = tip.y;
                        features[8]  = tip.z;
                        features[9]  = mcp.x;
                        features[10] = mcp.y;
                        features[11] = mcp.z;
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        features[12] = tip.x;
                        features[13] = tip.y;
                        features[14] = tip.z;
                        features[15] = mcp.x;
                        features[16] = mcp.y;
                        features[17] = mcp.z;
                        break;
                }
            }
            if(!mPlaySpeech) {
                // use simple tracking, if in music mode
                if(!simpleHands[i].isLeft) {
                    // index finger
                    if(f == 1) {
                        mTrackingResult = ofMap(tip.x,0,100,0,1,true);
                    }
                }
            } else {
                // use classes from other hand, too if in speech mode
                if(!simpleHands[i].isLeft) {
                    switch (f) {
                        case 0:
                            features[18] = tip.x;
                            features[19] = tip.y;
                            features[20] = tip.z;
                            features[21] = mcp.x;
                            features[22] = mcp.y;
                            features[23] = mcp.z;
                            break;
                        case 1:
                            features[24]  = tip.x;
                            features[25]  = tip.y;
                            features[26]  = tip.z;
                            features[27]  = mcp.x;
                            features[28] = mcp.y;
                            features[29] = mcp.z;
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            features[30] = tip.x;
                            features[31] = tip.y;
                            features[32] = tip.z;
                            features[33] = mcp.x;
                            features[34] = mcp.y;
                            features[35] = mcp.z;
                            break;
                    }
                }
            }
            
            ofSetColor(255,100);
            ofSetLineWidth(10);
            ofDrawLine(mcp.x, mcp.y, mcp.z, pip.x, pip.y, pip.z);
            ofDrawLine(pip.x, pip.y, pip.z, dip.x, dip.y, dip.z);
            ofDrawLine(dip.x, dip.y, dip.z, tip.x, tip.y, tip.z);
        }
    }
    cam.end();
    leapView.end();
    leapView.draw(left, top);
}

void ofApp::sendOSC() {
    if(fingersFound.size() > 0) {
        msg.clear();
        msg.setAddress(oscInputAddress);
        for (int i=0; i<features.size(); i++) {
            msg.addFloatArg(features[i]);
        }
        sender.sendMessage(msg);
    } else {
        msg.clear();
        msg.setAddress(oscInputAddress);
        for (int i=0; i<features.size(); i++) {
            msg.addFloatArg(0.);
        }
        sender.sendMessage(msg);
    }
}

void ofApp::receiveOSC() {
    while(receiver.hasWaitingMessages()){
        ofxOscMessage m;
        receiver.getNextMessage(&m);
        if(m.getAddress() == "/wek/outputs"){
            receiveString = ofToString(m.getArgAsInt(0));
            cout << m.getArgAsInt(1) << endl;
            if(m.getArgAsInt(0) < 5) {
                mClassificationResult = ofClamp(m.getArgAsInt(0) - 1,0,4);
                
                if(!mPlaySpeech) {
                    if(mClassificationResult == 1) {
                        soda.set("scale-0")->volume(1)->shift(mTrackingResult)->depth(0.3)->play();
                        soda.set("scale-1")->volume(0.2)->play();
                        soda.set("scale-2")->volume(0.2)->play();
                        soda.set("scale-3")->volume(0.2)->play();
                    }
                    if(mClassificationResult == 2) {
                        soda.set("scale-1")->volume(1)->shift(mTrackingResult)->pan(0.2)->play();
                        soda.set("scale-0")->volume(0.2)->play();
                        soda.set("scale-2")->volume(0.2)->play();
                        soda.set("scale-3")->volume(0.2)->play();
                    }
                    if(mClassificationResult == 3) {
                        soda.set("scale-2")->volume(1)->shift(mTrackingResult)->pan(0.3)->play();
                        soda.set("scale-0")->volume(0.2)->play();
                        soda.set("scale-1")->volume(0.2)->play();
                        soda.set("scale-3")->volume(0.2)->play();
                    }
                    if(mClassificationResult == 4) {
                        soda.set("scale-3")->volume(1)->shift(mTrackingResult)->play();
                        soda.set("scale-0")->volume(0.2)->play();
                        soda.set("scale-1")->volume(0.2)->play();
                        soda.set("scale-2")->volume(0.2)->play();
                    }
                    if(mClassificationResult == 0) {
                        soda.set("scale-3")->volume(0)->play();
                        soda.set("scale-0")->volume(0)->play();
                        soda.set("scale-1")->volume(0)->play();
                        soda.set("scale-2")->volume(0)->play();
                    }
                } else {
                    
                    if(m.getArgAsInt(1) == 1) {
                        mTrackingResult = 0.2;
                    }
                    if(m.getArgAsInt(1) == 2) {
                        mTrackingResult = 0.4;
                    }
                    if(m.getArgAsInt(1) == 3) {
                        mTrackingResult = 0.6;
                    }
                    if(m.getArgAsInt(1) == 4) {
                        mTrackingResult = 0.8;
                    }
                    if(m.getArgAsInt(1) == 5) {
                        mTrackingResult = 1;
                    }
                    
                    if(mClassificationResult == 0) {
                        if(speeches[0]->play(mTrackingResult)) {
                            soda.set("speech0")->depth(0.01)->pan(0.1)->play();
                        }
                        if(speeches[1]->play(mTrackingResult)) {
                            soda.set("speech1")->depth(0.01)->pan(0.3)->play();
                        }
                        if(speeches[2]->play(mTrackingResult)) {
                            soda.set("speech2")->depth(0.01)->pan(0.6)->play();
                        }
                        if(speeches[3]->play(mTrackingResult)) {
                            soda.set("speech3")->depth(0.01)->pan(0.9)->play();
                        }
                    }
                    if(mClassificationResult == 1) {
                        if(speeches[4]->play(mTrackingResult)) {
                            soda.set("speech4")->depth(0.01)->pan(0.1)->play();
                        }
                        if(speeches[5]->play(mTrackingResult)) {
                            soda.set("speech5")->depth(0.01)->pan(0.3)->play();
                        }
                        if(speeches[6]->play(mTrackingResult)) {
                            soda.set("speech6")->depth(0.01)->pan(0.6)->play();
                        }
                        if(speeches[7]->play(mTrackingResult)) {
                            soda.set("speech7")->depth(0.01)->pan(0.9)->play();
                        }

                    }
                    if(mClassificationResult == 2) {
                        if(speeches[8]->play(mTrackingResult)) {
                            soda.set("speech8")->depth(0.01)->pan(0.1)->play();
                        }
                        if(speeches[9]->play(mTrackingResult)) {
                            soda.set("speech9")->depth(0.01)->pan(0.3)->play();
                        }
                        if(speeches[10]->play(mTrackingResult)) {
                            soda.set("speech10")->depth(0.01)->pan(0.6)->play();
                        }
                        if(speeches[11]->play(mTrackingResult)) {
                            soda.set("speech11")->depth(0.01)->pan(0.9)->play();
                        }
                    }
                    if(mClassificationResult == 3) {
                        if(speeches[12]->play(mTrackingResult)) {
                            soda.set("speech12")->depth(0.01)->pan(0.1)->play();
                        }
                        if(speeches[13]->play(mTrackingResult)) {
                            soda.set("speech13")->depth(0.01)->pan(0.3)->play();
                        }
                        if(speeches[14]->play(mTrackingResult)) {
                            soda.set("speech14")->depth(0.01)->pan(0.6)->play();
                        }
                        if(speeches[15]->play(mTrackingResult)) {
                            soda.set("speech15")->depth(0.01)->pan(0.9)->play();
                        }

                    }
                }
                //cout << "received class is: " << receiveString << endl;
                //cout << "right hand: " << mTrackingResult/4. << endl;
            }
        } else{
            // unrecognized message: display on the bottom of the screen
            receiveString = m.getAddress();
            receiveString += ": ";
            for(int i = 0; i < m.getNumArgs(); i++){
                // get the argument type
                receiveString += m.getArgTypeName(i);
                receiveString += ":";
                // display the argument - make sure we get the right type
                if(m.getArgType(i) == OFXOSC_TYPE_INT32){
                    receiveString += ofToString(m.getArgAsInt32(i));
                }
                else if(m.getArgType(i) == OFXOSC_TYPE_FLOAT){
                    receiveString += ofToString(m.getArgAsFloat(i));
                }
                else if(m.getArgType(i) == OFXOSC_TYPE_STRING){
                    receiveString += m.getArgAsString(i);
                }
                else{
                    receiveString += "unknown";
                }
            }
            cout << receiveString << endl;
        }
    }
}

void ofApp::keyPressed(int key){
    if(key== ' ') {
        soda.set("s1")->play();
    }
}
void ofApp::keyReleased(int key){}
void ofApp::mouseMoved(int x, int y ){}
void ofApp::mouseDragged(int x, int y, int button){}
void ofApp::mousePressed(int x, int y, int button){
    string btn = "";
    if(bTrain->over(ofVec2f(x,y)) != "" ) {
        btn = bTrain->over(ofVec2f(x,y));
    }
    if(bRun->over(ofVec2f(x,y)) != "" ) {
        btn = bRun->over(ofVec2f(x,y));
    }
    if(bRecord->over(ofVec2f(x,y)) != "" ) {
        btn = bRecord->over(ofVec2f(x,y));
    }
    if(bStopRecord->over(ofVec2f(x,y)) != "" ) {
        btn = bStopRecord->over(ofVec2f(x,y));
    }
    
    if(btn != "") {
        cout << btn << endl;
        if(btn == "RUN") {
            msg.clear();
            msg.setAddress(oscStartRunning);
            sender.sendMessage(msg);
        }
        if(btn == "TRAIN") {
            msg.clear();
            msg.setAddress(oscStartTraining);
            sender.sendMessage(msg);
        }
        if(btn == "RECORD") {
            msg.clear();
            msg.setAddress(oscStartRecording);
            sender.sendMessage(msg);
        }
        if(btn == "STOP") {
            msg.clear();
            msg.setAddress(oscStopRecording);
            sender.sendMessage(msg);
        }
    }
}
void ofApp::mouseReleased(int x, int y, int button){}
void ofApp::windowResized(int w, int h){}
void ofApp::gotMessage(ofMessage msg){}
void ofApp::dragEvent(ofDragInfo dragInfo){}


void ofApp::audioReceived(float * input, int bufferSize, int nChannels) {
    soda.audioReceived(input, bufferSize, nChannels);
}

void ofApp::audioRequested(float * output, int bufferSize, int nChannels) {
    soda.audioRequested(output, bufferSize, nChannels);
}


void ofApp::exit(){
    leap.close();
}
