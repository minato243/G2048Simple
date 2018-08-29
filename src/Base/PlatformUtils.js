/** Created by thaod on 1/8/2018.*/

var PlatformUtils = cc.Class.extend({

    signInGoogle: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "signIn","()V");
    },

    shareMyApp: function(){
        //this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT,"shareMyApp","()V");
    },

    rateApp: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT,"rateMyApp","()V");
    },

    showHighScore: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "showAllRanking","()V");
    },

    updateScore: function(score){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "updateHighScore", "(I)V", score);
    },

    showInterstitialAd: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "showInterstitialAd", "()V")
    },

    showVideoRewardAd: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "showVideoRewardAd", "()V");
    },

    initBanner: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "initBanner", "()V");
    },

    showBanner: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "showBanner", "()V");
    },

    hideBanner: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "hideBanner", "()V");
    },

    updateLeaderBoard: function(mode, score){
        cc.log("PlatformUtils.updateLeaderBoard mode = "+ mode + "score = "+ score);
        if(sys.platform ==  sys.WIN32) return;
        jsb.reflection.callStaticMethod(PlatformUtils.CLASS_DEFAULT, "updateLeaderBoard","(II)V", mode, score);
    },

    callAndroidFunction: function(className, methodName, methodSignature, parameters){
        if(sys.platform ==  sys.WIN32) return;
        var returnValue;
        if(parameters == undefined) returnValue = jsb.reflection.callStaticMethod(className, methodName,methodSignature);
        else returnValue = jsb.reflection.callStaticMethod(className, methodName,methodSignature, parameters);
        cc.log("PlatformUtils.callAndroidFunction "+ returnValue);
    },

    javaCallBackAddGold: function(num){
        GameDataMgr.getInstance().addGold(num);
        var playScene = PlayScene.getInstance();
        if(playScene != null && playScene.isRunning()) {
            playScene.layer.updateCoin();
            playScene.layer.showAddGoldEffect(num);
        }
    }

});

PlatformUtils.instance = null;

PlatformUtils.getInstance = function(){
    if(PlatformUtils.instance == null){
        PlatformUtils.instance = new PlatformUtils();
    }

    return PlatformUtils.instance;
};

PlatformUtils.destroyInstance = function(){
    if(PlatformUtils.instance!= null){
        PlatformUtils.instance.release();
    }
};

PlatformUtils.CLASS_DEFAULT = "com.anhnt.g2048.AndroidUtils";
utf8Decode = function(utf8String) {
    if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    const unicodeString = utf8String.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
            return String.fromCharCode(cc); }
    ).replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
            return String.fromCharCode(cc); }
    );
    return unicodeString;
};

utf8Encode = function(unicodeString) {
    if (typeof unicodeString != 'string') throw new TypeError('parameter ‘unicodeString’ is not a string');
    const utf8String = unicodeString.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    ).replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
    return utf8String;
}

