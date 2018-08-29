/**
 * Created by thaod on 6/20/2018.
 * MenuSceneLayer
 */


var MenuSceneLayer = cc.Layer.extend({

    bgImage: null,
    playButton: null,
    highScoreButton: null,
    gameData: null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.initGui();
        this.addKeyBoardListener();
        this.initData();
        return true;
    },

    initGui: function(){
        var menuScene = ccs.load(res.MenuScene_json);
        this.addChild(menuScene.node, 1);

        this.bgImage = menuScene.node.getChildByName("bgImage");
        this.playButton = this.bgImage.getChildByName("btn_play");
        this.highScoreButton = this.bgImage.getChildByName("btn_high_score");

        var bgSelect = this.bgImage.getChildByName("bg_menu");
        this.nextButton = bgSelect.getChildByName("btn_next");
        this.previousButton = bgSelect.getChildByName("btn_previous");

        this.nextButton.addTouchEventListener(this.onNextMode, this);
        this.previousButton.addTouchEventListener(this.onPreviousMode, this);

        this.modeImage = this.bgImage.getChildByName("img_mode");
        this.modeLabel = bgSelect.getChildByName("lb_mode");

        this.playButton.addTouchEventListener(this.onPlay, this);
        this.highScoreButton.addTouchEventListener(this.onHighScore, this);

        this.homeButton = this.bgImage.getChildByName("btn_home");
        this.soundOnButton = this.bgImage.getChildByName("btn_sound_on");
        this.soundOffButton = this.bgImage.getChildByName("btn_sound_off");
        this.homeButton.addTouchEventListener(this.onClickHome, this);
        this.soundOnButton.addTouchEventListener(this.onSoundOn, this);
        this.soundOffButton.addTouchEventListener(this.onSoundOff, this);
    },

    addKeyBoardListener: function(){
        var self = this;
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                cc.log("MenuSceneLayer.addKeyBoardListener keyCode = "+keyCode);
                if(keyCode == cc.KEY.backspace || keyCode == cc.KEY.back){
                    self.onBackPress();
                }else if(keyCode == cc.KEY.home){
                    //do something
                }
            }
        });

        cc.eventManager.addListener(keyboardListener, this.bgImage);
    },

    initData: function(){
        this.gameData = GameDataMgr.gameDataMgrInstance;
        SoundManager.getInstance();
        this.updateSelectedMode();
        this.soundOnButton.setVisible(SoundManager.instance.status);
        this.soundOffButton.setVisible(!SoundManager.instance.status);
    },

    updateSelectedMode: function(){
        cc.log("updateSelectedMode");
        cc.Sprite.create("#ic_mode_2.png");
        var spriteFrameStr = "ic_mode_"+ String(this.gameData.mode+1)+".png";
        cc.log(spriteFrameStr);
        this.modeImage.setSpriteFrame(spriteFrameStr);

        var modeStr = GAME_MATRIX_SIZE[this.gameData.mode]+"x"+GAME_MATRIX_SIZE[this.gameData.mode];
        cc.log(modeStr);
        this.modeLabel.setString(modeStr);
    },

    onPlay: function(pSender, controlEvent){
        cc.log("onClickPlay");

        Utility.setScaleWhenTouchButton(pSender, controlEvent);

        if(controlEvent != ccui.Widget.TOUCH_ENDED) return;
        SoundManager.playClickSound();
        ScreenMgr.getInstance().changeScreen(PLAY_SCREEN);
    },

    onClickExit: function(pSender, controlEvent){
        cc.log("onClickExit");

        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent != ccui.Widget.TOUCH_ENDED) return;
        SoundManager.playClickSound();
        cc.director.end();
    },

    onHighScore: function(pSender, controlEvent){
        cc.log("onClickHighScore");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            PlatformUtils.getInstance().showHighScore();
        }
    },

    onNextMode: function(pSender, controlEvent){
        Utility.setScaleWhenTouchButton(pSender, controlEvent);

        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            this.gameData.nextMode();
            this.updateSelectedMode();
        }

    },

    onPreviousMode: function(pSender, controlEvent){
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            this.gameData.previousMode();
            this.updateSelectedMode();
        }
    },

    onBackPress: function(){
        cc.log("onBackPress");
        this.acceptCallBack = cc.callFunc(this.doBackPress, this);
        MessageDialog.destroyInstance();
        var dialog = MessageDialog.getInstance();
        dialog.startDialog(this.acceptCallBack, null, "Are you sure want to quit this game?");
        dialog.setAcceptLabel("Quit");
        dialog.setCancelLabel("Cancel");
    },

    onClickHome: function (pSender, controlEvent) {
        cc.log("onHome");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);

        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            this.onBackPress();
        }
    },

    onSoundOn: function (pSender, controlEvent) {
        cc.log("onSoundOn");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            SoundManager.instance.setMusicOff();
            this.soundOffButton.setVisible(true);
            this.soundOnButton.setVisible(false);
        }
    },

    onSoundOff: function (pSender, controlEvent) {
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            SoundManager.instance.setMusicOn();
            this.soundOffButton.setVisible(false);
            this.soundOnButton.setVisible(true);
        }
    },

    doBackPress: function(){
        cc.log("doBackPress");
        cc.director.end();
    }
});

MenuSceneLayer.menuSceneLayerInstance = null;

MenuSceneLayer.getInstance = function(){
    if(MenuSceneLayer.menuSceneLayerInstance == null){
        MenuSceneLayer.menuSceneLayerInstance = new MenuSceneLayer();
        MenuSceneLayer.menuSceneLayerInstance.retain();
    }

    return MenuSceneLayer.menuSceneLayerInstance;
};

