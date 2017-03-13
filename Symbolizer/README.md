# Symbolizer
Gesture based communication language using classification models, combined with position tracking. Tracking is made with a Leap motion controller, the gestrue recognition is made with Wekinator. 

# Installation
Could not make it using project generator, ofxLeapMotion2 can't be compiled. Workaround: make a project by copying the example project from ofxLeapMotion2. Then, add the following addons to your project: 
- ofxPd
- ofxOsc
- ofxSodaLib (you have to set the path to SodaLib's lib folder, also in order to find the patch *main.pd*'). 

Trying to clean this up if I have time 

# How it works 

Load included wekinator project file and start listening / sending OSC messages to the app.

