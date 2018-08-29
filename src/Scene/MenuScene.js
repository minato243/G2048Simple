
/**
 * Created by thaod on 6/20/2018.
 * MenuScene
 */

var MenuScene = cc.Scene.extend({
    menuLayer: null,

    ctor: function(){
        this._super();
        GameDataMgr.createInstance();
        PlatformUtils.getInstance().initBanner();
        PlatformUtils.getInstance().showBanner();
    },

    onEnter:function () {
        cc.log("MenuScreen.onEnter");
        this._super();
        this.menuLayer = new MenuSceneLayer();
        if (this.menuLayer.getParent() == null)
            this.addChild(this.menuLayer);
        ScreenMgr.getInstance().setCurrentScreen(this);
        PlatformUtils.getInstance().signInGoogle();
    },

    onExit: function(){
        cc.log("MenuScene.onExit");
        this._super();
    }

});

MenuScene.menuSceneInstance = null;
MenuScene.getInstance = function(){
    if(MenuScene.menuSceneInstance == null){
        MenuScene.menuSceneInstance = new MenuScene();
        MenuScene.menuSceneInstance.retain();
    }

    return MenuScene.menuSceneInstance;
};
