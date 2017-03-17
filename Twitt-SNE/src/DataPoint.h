#pragma once

class DataPoint {
public:
    string mDate;
    string mText;
    int mScore;
    float mComp;
    
    DataPoint(string date, string text, int score, float comp) {
        mDate = date;
        mText = text;
        mScore = score;
        mComp = comp;
    }
};
