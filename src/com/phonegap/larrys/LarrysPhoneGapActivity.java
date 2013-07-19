package com.phonegap.larrys;

import android.os.Bundle;

import org.apache.cordova.DroidGap;

public class LarrysPhoneGapActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        
    }
}