# Line-Feature-Extractor
Extracting features from hand drawn lines for classification in wekinator

# Build
Make a project with Project Generator (OpenFrameworks 0.9+), add ofxOsc addons to the project

# How it works 
When drawing a line, after releasing, the app sends a list of features to Wekinator through OSC. The first 120 elements are the angles of each recorded drawing segment, while the following other 120 points are the velocity of each drawing segment. If using both, wekinator needs to be setup to receive 240 inputs. If using only the angles, wekinator should be setup to receive 120 inputs.

Got much better results with using the angle features only. k-Nearest Neighbor with k=2 works prety well to recognize simple shapes.

Wekinator sends back the recognized class (needs to be setup to use one output only), the app plays a sound according to the received value.

Pressing 'r' is switching between recording and playback mode. (Recording is automated thru OSC)
