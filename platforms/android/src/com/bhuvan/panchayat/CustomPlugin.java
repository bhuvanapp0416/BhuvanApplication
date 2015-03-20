package com.bhuvan.panchayat;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;

import android.content.Context;
import android.telephony.TelephonyManager;
import android.util.Log;

public class CustomPlugin extends CordovaPlugin {
	@Override
	public boolean execute(String action, CordovaArgs args,
			CallbackContext callbackContext) throws JSONException {
		String returnString = "";
		Log.d("Custom Plugin executing action:", action);
		if (action.equals("getPhoneNumber")) {
			returnString = phone();
		} else if (action.equals("getImeiNumber")) {
			returnString = imei();
		}
		callbackContext.success(returnString);
		return true;
	}

	public String imei() {
		TelephonyManager telephonyManager = (TelephonyManager) this.cordova
				.getActivity().getApplicationContext()
				.getSystemService(Context.TELEPHONY_SERVICE);
		return telephonyManager.getDeviceId();
	}
	public String phone() {
		TelephonyManager tm = (TelephonyManager)this.cordova
				.getActivity().getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE); 
		String myPhoneNumber =  tm.getLine1Number();
		return myPhoneNumber;
	}
	
}
