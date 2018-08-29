var ScreenMgr = cc.Class.extend({
   currentScreen: null,

   ctor: function(){
       this.currentScreen = null;
   },

   changeScreen: function(screenId){
       PlatformUtils.getInstance().showInterstitialAd();
        switch (screenId){

            case LOADING_SCREEN:
            {
                this.currentScreen = new LoadingScreen();
                cc.director.runScene(new cc.TransitionFade(0.5, this.currentScreen));
                break;
            }

            case MENU_SCREEN:
            {
                this.currentScreen = new MenuScene();
                cc.director.runScene(new cc.TransitionFade(0.125, this.currentScreen));
                PlatformUtils.getInstance().showBanner();
                break;
            }

            case PLAY_SCREEN:
            {
                this.currentScreen = new PlayScene();
                cc.log("currentScreen "+ this.currentScreen);
                cc.director.runScene(new cc.TransitionFade(0.5, this.currentScreen));
                PlatformUtils.getInstance().showBanner();
                break;
            }

            default :
            {

            }
        }

        return this.currentScreen;
   },

    setCurrentScreen: function(screen){
        this.currentScreen = screen;
    }

});

ScreenMgr.screenMgrInstance = null;

ScreenMgr.getInstance = function()
{
    if(ScreenMgr.screenMgrInstance == null){
        ScreenMgr.screenMgrInstance = new ScreenMgr();
    }
    return ScreenMgr.screenMgrInstance;
}