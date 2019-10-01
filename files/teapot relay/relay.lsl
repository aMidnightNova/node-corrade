
// parts of this source made possible from the amazing people at Wizardry and Steamworks http://grimore.org/

// Corrade is http://grimore.org/secondlife/scripted_agents/corrade


key NOTECARD_QUERY_ID;
string NOTECARD_NAME = "config";
integer NOTECARD_LINE = 0;

integer BOT_IN_REGION;

key BOT_UUID;
string RELAY_COMMAND_HANDLE;
string SHARED_SECRET;

integer LISTEN_HANDLE;


string CALLBACK_URL;
key URL_REQUEST_KEY;


isBotInRegion() {
    string name = llKey2Name(BOT_UUID);
    if(name != "" ) {
        BOT_IN_REGION = TRUE;
    } else {
        BOT_IN_REGION = FALSE;
    }

}

mrFormatThenIMBot(string msg, key person_who_said_command) {
    string MESSAGE = llDumpList2String(llList2List(llParseString2List(msg, [ " " ], []), 1, -1), " ");

    string message = wasKeyValueEncode(
    [
    "message",wasURLEscape("@"+MESSAGE),
    "callback_url",CALLBACK_URL,
    "x_real_agent", person_who_said_command,
    "token",SHARED_SECRET
    ]);

    if(BOT_IN_REGION) {
        llRegionSayTo(BOT_UUID,0,message);
    } else {
        llInstantMessage(BOT_UUID, message);
    }
}


integer isCommandToRelay(string s) {
    list iList = llParseString2List(s, [ " " ], []) ;
    if( llList2String(iList, 0) != "@"+RELAY_COMMAND_HANDLE) {
        return FALSE;
    }
    return TRUE;
}


string wasKeyValueEncode(list data) {
    list k = llList2ListStrided(data, 0, -1, 2);
    list v = llList2ListStrided(llDeleteSubList(data, 0, 0), 0, -1, 2);
    data = [];
    do {
        data += llList2String(k, 0) + "=" + llList2String(v, 0);
        k = llDeleteSubList(k, 0, 0);
        v = llDeleteSubList(v, 0, 0);
    } while(llGetListLength(k) != 0);
    return llDumpList2String(data, "&");
}



string wasURLEscape(string i) {
    string o = "";
    do {
        string c = llGetSubString(i, 0, 0);
        i = llDeleteSubString(i, 0, 0);
        if(c == "") jump continue;
        if(c == " ") {
            o += "+";
            jump continue;
        }
        if(c == "\n") {
            o += "%0D" + llEscapeURL(c);
            jump continue;
        }
        o += llEscapeURL(c);
@continue;
    } while(i != "");
    return o;
}




default {
    state_entry() {
        URL_REQUEST_KEY = llRequestSecureURL();
        NOTECARD_QUERY_ID = llGetNotecardLine(NOTECARD_NAME, NOTECARD_LINE);

    }


    on_rez(integer start_param) {
        URL_REQUEST_KEY = llRequestSecureURL();
    }
    changed(integer change) {

        if (change & (CHANGED_REGION | CHANGED_REGION_START)) {
            llReleaseURL(URL_REQUEST_KEY);
            URL_REQUEST_KEY = llRequestSecureURL();
        }

    }







    dataserver(key quid, string data){
        if (quid == NOTECARD_QUERY_ID){
            if (data == EOF) {
                NOTECARD_LINE = 0;

                if (BOT_UUID == "") {
                    llOwnerSay("BOT_UUID is not defined in config");
                    return;
                } else if (RELAY_COMMAND_HANDLE == "") {
                    llOwnerSay("RELAY_COMMAND_HANDLE is not defined in config");
                    return;
                }

                LISTEN_HANDLE = llListen(0, "", "", "");
                llOwnerSay("Relay online");
                isBotInRegion();

                llSetTimerEvent(60);
            } else {
                ++NOTECARD_LINE;

                if(data == ""){
                    NOTECARD_QUERY_ID = llGetNotecardLine(NOTECARD_NAME, NOTECARD_LINE);
                    return;
                }

                integer maybeHashIndex = llSubStringIndex(data, "#");
                if( maybeHashIndex != -1) {
                    if(maybeHashIndex == 0) {
                        NOTECARD_QUERY_ID = llGetNotecardLine(NOTECARD_NAME, NOTECARD_LINE);
                        return;
                    } else {
                        data = llStringTrim(llList2String(llParseString2List(data, ["#"], [""]),0),STRING_TRIM);
                    }
                }


                list VAR_AND_ASSIGNMENT = llParseString2List(data, ["="], [""]);

                if (llList2String(VAR_AND_ASSIGNMENT, 0) == "BOT_UUID") {
                    BOT_UUID = llList2String(VAR_AND_ASSIGNMENT,1);
                } else if (llList2String(VAR_AND_ASSIGNMENT, 0) == "RELAY_COMMAND_HANDLE") {
                    RELAY_COMMAND_HANDLE = llList2String(VAR_AND_ASSIGNMENT, 1);
                } else if (llList2String(VAR_AND_ASSIGNMENT, 0) == "SHARED_SECRET") {
                    SHARED_SECRET = llList2String(VAR_AND_ASSIGNMENT, 1);
                }

                NOTECARD_QUERY_ID = llGetNotecardLine(NOTECARD_NAME, NOTECARD_LINE);

            }
        }
    }


    listen(integer channel, string name, key id, string message) {
        if(isCommandToRelay(message)) {
                mrFormatThenIMBot(message, id);
        }
    }


    timer() {
        isBotInRegion();
    }




    http_request(key qID, string method, string body) {

        if( qID == URL_REQUEST_KEY ) {
            if (method == URL_REQUEST_DENIED) {
                llOwnerSay("ERROR: " + body);
                llOwnerSay("Try to pic up and then re-rez the object.");
            } else if (method == URL_REQUEST_GRANTED) {
                CALLBACK_URL = body;
            }
        }

        if(method == "POST") {
            llSay(0,body);
            llHTTPResponse(qID, 200, "OK");
        }
    }


}
